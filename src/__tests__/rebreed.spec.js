import hatch from '../';

test('breed improves existing breeds', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0, color: 'yellow' }));
  };
  const grayChickEgg = ({ breed }) => {
    breed('chick', ({ chick }) => ({ ...chick, color: 'gray' }));
  };

  const { chick } = hatch(chickEgg, grayChickEgg);
  expect(chick).toEqual({ type: 'chicken', days: 0, color: 'gray' });
});

test('breeds values before definition are undefined', () => {
  const grayChickEgg = ({ breed }) => {
    breed('chick', ({ chick }) => ({ ...chick, color: 'gray' }));
  };

  const { chick } = hatch(grayChickEgg);
  expect(chick).toEqual({ color: 'gray' });
});

test('you can chain multiple rebreedings of itself', () => {
  const chickEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const largeEgg = ({ breed }) => {
    breed('chick', ({ chick }) => ({ ...chick, size: 'large' }));
  };
  const grayChickEgg = ({ breed }) => {
    breed('chick', ({ chick }) => ({ ...chick, color: 'gray' }));
  };

  const { chick } = hatch(chickEgg, largeEgg, grayChickEgg);
  expect(chick).toEqual({
    type: 'chicken',
    days: 0,
    color: 'gray',
    size: 'large'
  });
});

test('if you rebreed the same multiple times, it executes once', () => {
  const log = [];
  const anEgg = ({ breed }) => {
    breed('a', () => log.push('a0'));
    breed('a', ({ a }) => log.push(a && 'a1'));
    breed('b', ({ a }) => log.push(a && 'b'));
    breed('c', ({ b, a }) => log.push(a && b && 'c'));
    breed('a', ({ a }) => log.push(a && 'a2'));
  };

  const { c } = hatch(anEgg);
  expect(c).toEqual(5);
  expect(log).toEqual(['a0', 'a1', 'a2', 'b', 'c']);
});

test('rebreeds and their original breeds are not executed if they are not consumed', () => {
  const log = [];
  const anEgg = ({ breed }) => {
    breed('a', () => log.push('a0'));
    breed('a', ({ a }) => log.push(a, 'a1'));
  };

  hatch(anEgg);
  expect(log).toEqual([]);
});

describe('regresion tests', () => {
  test('eggs can be added multiple times but are hatched once, as soon as possible', () => {
    const log = [];

    const anEgg = () => log.push('a');
    const bEgg = () => log.push('b');
    const cEgg = () => log.push('c');

    hatch(anEgg, bEgg, anEgg, cEgg);

    expect(log).toEqual(['a', 'b', 'c']);
  });

  test('messing with rebreedings and rebreedings orders', () => {
    const egg1 = ({ breed }) => {
      breed('a', () => '1a');
      breed('b', ({ a, b }) => ['1b', a, b]);
    };
    const egg2 = ({ breed }) => {
      breed('a', ({ a }) => ['2a', a]);
      breed('b', ({ a, b }) => ['2b', a, b]);
    };
    const egg3 = ({ breed }) => {
      breed('a', ({ a }) => ['3a', a]);
      breed('b', ({ a, b }) => ['3b', a, b, b]);
    };

    const { b } = hatch(egg1, egg2, egg3);
    expect(b).toEqual([
      '3b',
      ['3a', ['2a', '1a']],
      ['2b', ['3a', ['2a', '1a']], ['1b', ['3a', ['2a', '1a']], undefined]],
      ['2b', ['3a', ['2a', '1a']], ['1b', ['3a', ['2a', '1a']], undefined]]
    ]);
  });
});
