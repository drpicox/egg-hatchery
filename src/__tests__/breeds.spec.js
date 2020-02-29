import hatch from '../';
import { push } from './helpers/push';

test('you can breed multiple things in a single egg', () => {
  const animalsEggs = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
    breed('duckling', () => ({ type: 'duck', days: 0 }));
  };
  const farmEgg = ({ breed }) => {
    breed('farm', ({ chick, duckling }) => ({ chick, duckling }));
  };

  const { farm } = hatch(animalsEggs, farmEgg);
  expect(farm).toEqual({
    chick: { type: 'chicken', days: 0 },
    duckling: { type: 'duck', days: 0 }
  });
});

test('the only viable breeds are those that are getted, no other breed functions are executed', () => {
  const log = [];
  const egg = ({ breed }) => {
    breed('a', () => push(log, 'a').return(1));
    breed('b', () => push(log, 'b').return(2));
    breed('c', () => push(log, 'c').return(3));
  };

  const { a, c } = hatch(egg);
  expect(a).toBe(1);
  expect(c).toBe(3);
  expect(log).toEqual(['a', 'c']);
});

test('breeds are executed in the same order that they are consumed', () => {
  const log = [];
  const egg = ({ breed }) => {
    breed('a', () => push(log, 'a').return(1));
    breed('b', () => push(log, 'b').return(2));
    breed('c', () => push(log, 'c').return(3));
  };

  const breeds = hatch(egg);
  expect(breeds.c).toBe(3);
  expect(breeds.a).toBe(1);
  expect(log).toEqual(['c', 'a']);
});

test('breed function is executed once at most, even if it is used twice', () => {
  const log = [];
  const egg = ({ breed }) => {
    breed('a', () => push(log, 'a').return(1));
    breed('b', () => push(log, 'b').return(2));
    breed('c', () => push(log, 'c').return(3));
  };

  const breeds = hatch(egg);
  expect(breeds.c).toBe(3);
  expect(breeds.a).toBe(1);
  expect(breeds.c).toBe(3);
  expect(log).toEqual(['c', 'a']);
});

test('first all hatchings starts and then all breedings continue', () => {
  const log = [];
  const aEgg = ({ breed }) => {
    breed('a', () => push(log, 'breed a').return(1));
    log.push('hatch a');
  };
  const bEgg = ({ breed }) => {
    breed('b', () => push(log, 'breed b').return(2));
    log.push('hatch b');
  };

  const { a, b } = hatch(aEgg, bEgg);
  expect(a).toBe(1);
  expect(b).toBe(2);
  expect(log).toEqual(['hatch a', 'hatch b', 'breed a', 'breed b']);
});

test('the hatching order does not affects for getting other breeds, you have always access to all breeds', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const farmerEgg = ({ breed }) => {
    breed('farmer', ({ chick }) => ({ hasChicks: !!chick }));
  };

  const { farmer: farmerOrder1 } = hatch(chickEgg, farmerEgg);
  const { farmer: farmerOrder2 } = hatch(farmerEgg, chickEgg);

  expect(farmerOrder1).toHaveProperty('hasChicks', true);
  expect(farmerOrder2).toHaveProperty('hasChicks', true);
});

test('an egg can access to its own breeds from breed', () => {
  const farmEgg = ({ breed }) => {
    breed('farmer', ({ chick }) => ({ hasChicks: !!chick }));
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };

  const { farmer } = hatch(farmEgg);
  expect(farmer).toHaveProperty('hasChicks', true);
});

test.each`
  name
  ${null}
  ${undefined}
  ${0}
  ${1}
  ${NaN}
  ${''}
  ${[]}
  ${['hello']}
  ${{}}
  ${true}
  ${false}
  ${() => {}}
  ${() => 'hello'}
`('hatch fails if a breed name is not valid, case <$name>', ({ name }) => {
  const egg = ({ breed }) => breed(name, () => {});

  expect(() => hatch(egg)).toThrow(
    /invalid breed name, expected the first argument to be a non-empty string but received/
  );
});

test.each`
  fn
  ${null}
  ${undefined}
  ${0}
  ${1}
  ${NaN}
  ${''}
  ${'hello'}
  ${[]}
  ${['hello']}
  ${{}}
  ${true}
  ${false}
`('hatch fails if a breed function is not a function, case <$fn>', ({ fn }) => {
  const egg = ({ breed }) => breed('a', fn);

  expect(() => hatch(egg)).toThrow(
    /invalid breed function, expected the second argument to be a function but received/
  );
});

test(`breed breed fails if there is a cycle in breedings`, () => {
  const egg = ({ breed }) => {
    breed('a', ({ b }) => b);
    breed('b', ({ a }) => a);
  };

  const breeds = hatch(egg);
  expect(() => breeds.a).toThrow(
    /breed cycle detected, it uses breeds that uses/
  );
});

test(`breed fails if a breeding function tries to change its input object`, () => {
  const egg = ({ breed }) => {
    breed('a', input => {
      input.illegalChange = true;
    });
  };

  const breeds = hatch(egg);
  expect(() => breeds.a).toThrow();
});

test(`breed a hatching breed fails when hatch is finished`, () => {
  const egg = ({ breed }) => {
    breed('breed', () => breed);
  };

  const { breed } = hatch(egg);
  expect(() => breed('a', () => {})).toThrow(
    /breed a hatching breed fails when hatch is finished/
  );
});

test(`breed fails if a breeding function tries to create another hatching breed`, () => {
  const egg = ({ breed }) => {
    breed('a', () => {
      breed('b', () => {});
    });
  };

  const breeds = hatch(egg);
  expect(() => breeds.a).toThrow(
    /breed a hatching breed fails when hatch is finished/
  );
});
