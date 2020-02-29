import hatch from '../';
import { push } from './helpers/push';

test('create and hatch your own egg', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };

  const { chick } = hatch(chickEgg);
  expect(chick).toEqual({ type: 'chicken', days: 0 });
});

test('hatch as many eggs as you want at once', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const ducklingEgg = ({ breed }) => {
    breed('duckling', () => ({ type: 'duck', days: 0 }));
  };

  const { chick, duckling } = hatch(chickEgg, ducklingEgg);
  expect(chick).toEqual({ type: 'chicken', days: 0 });
  expect(duckling).toEqual({ type: 'duck', days: 0 });
});

test('breed new things combining other eggs breeds', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const ducklingEgg = ({ breed }) => {
    breed('duckling', () => ({ type: 'duck', days: 0 }));
  };
  const farmEgg = ({ breed }) => {
    breed('farm', ({ chick, duckling }) => ({ chick, duckling }));
  };

  const { farm } = hatch(chickEgg, ducklingEgg, farmEgg);
  expect(farm).toEqual({
    chick: { type: 'chicken', days: 0 },
    duckling: { type: 'duck', days: 0 }
  });
});

test('group your eggs in arrays as your convenience', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const ducklingEgg = ({ breed }) => {
    breed('duckling', () => ({ type: 'duck', days: 0 }));
  };
  const animalsEggs = [chickEgg, ducklingEgg];
  const farmEgg = ({ breed }) => {
    breed('farm', ({ chick, duckling }) => ({ chick, duckling }));
  };

  const { farm } = hatch(animalsEggs, farmEgg);
  expect(farm).toEqual({
    chick: { type: 'chicken', days: 0 },
    duckling: { type: 'duck', days: 0 }
  });
});

test('it does not matter how you organitze eggs inside arrays, they always hatch', () => {
  const aEgg = ({ breed }) => breed('a', () => 1);
  const bEgg = ({ breed }) => breed('b', () => 2);
  const cEgg = ({ breed }) => breed('c', () => 3);

  const { a, b, c } = hatch([aEgg, [[[[bEgg]]], [[[[[cEgg]]]]]]]);
  expect(a).toBe(1);
  expect(b).toBe(2);
  expect(c).toBe(3);
});

test('eggs are always hatched (function executed) although none of its breeds is used', () => {
  const log = [];
  const aEgg = ({ breed }) => {
    breed('a', () => push(log, 'breed a').return(1));
    log.push('hatch a');
  };
  const bEgg = ({ breed }) => {
    breed('b', () => push(log, 'breed b').return(2));
    log.push('hatch b');
  };

  const { a } = hatch(aEgg, bEgg);
  expect(a).toBe(1);
  expect(log).toEqual(['hatch a', 'hatch b', 'breed a']);
});

test('eggs can be added multiple times but are hatched once, as soon as possible', () => {
  const log = [];

  const aEgg = () => log.push('a');
  const bEgg = () => log.push('b');
  const cEgg = () => log.push('c');

  hatch(aEgg, bEgg, aEgg, cEgg);

  expect(log).toEqual(['a', 'b', 'c']);
});

test('hatch result cannot be manipulated', () => {
  const egg = ({ breed }) => {
    breed('a', () => 1);
  };

  const breeds = hatch(egg);
  expect(breeds.a).toBe(1);
  expect(() => {
    breeds.a = 2;
  }).toThrow();
  expect(() => {
    breeds.b = 3;
  }).toThrow();
});

test.each`
  egg
  ${null}
  ${undefined}
  ${0}
  ${1}
  ${NaN}
  ${''}
  ${'hello'}
  ${{}}
  ${true}
  ${false}
`('hatch fails if any egg is not a function, case <$egg>', ({ egg }) => {
  expect(() => hatch(egg)).toThrow(
    /received egg is not an egg, expected a function but received/
  );

  expect(() => hatch([egg])).toThrow(
    /received egg is not an egg, expected a function but received/
  );

  expect(() => hatch(() => {}, egg)).toThrow(
    /received egg is not an egg, expected a function but received/
  );
});

test('if something is not an egg, no egg hatches', () => {
  const log = [];
  const anEgg = () => log.push('an Egg opened');
  const noEgg = 'I am not an egg';

  expect(() => hatch(anEgg, noEgg)).toThrow();
  expect(log).toEqual([]);
});
