import hatch from '../';

test('add tools to enable more tools to the following eggs', () => {
  const plumageEgg = ({ tool }) =>
    tool('withPlumage', bird => ({ ...bird, plumage: true }));

  const chickenEgg = ({ breed, withPlumage }) =>
    breed('chick', () => withPlumage({ type: 'chicken', days: 0 }));

  const { chick } = hatch(plumageEgg, chickenEgg);

  expect(chick).toEqual({ type: 'chicken', days: 0, plumage: true });
});

test('use tools to mutate breeds before hatching', () => {
  const birdEgg = ({ tool, breed }) => {
    let birdType = 'chicken';
    tool('withBirdType', newType => (birdType = newType));

    breed('bird', () => ({ type: birdType, days: 0 }));
  };

  const birdsAreDucksEgg = ({ withBirdType }) => {
    withBirdType('duck');
  };

  const { bird: chick } = hatch(birdEgg);
  const { bird: duckling } = hatch(birdEgg, birdsAreDucksEgg);

  expect(chick).toEqual({ type: 'chicken', days: 0 });
  expect(duckling).toEqual({ type: 'duck', days: 0 });
});

describe('deep details', () => {
  test('overwrite tools with new tools', () => {
    const plumageEgg = ({ tool }) =>
      tool('withPlumage', bird => ({ ...bird, plumage: true }));

    const finePlumageEgg = ({ tool }) =>
      tool('withPlumage', bird => ({ ...bird, plumage: 'fine' }));

    const chickenEgg = ({ breed, withPlumage }) =>
      breed('chick', () => withPlumage({ type: 'chicken', days: 0 }));

    const { chick: plumageChick } = hatch(plumageEgg, chickenEgg);
    const { chick: finePlumageChick } = hatch(
      plumageEgg,
      finePlumageEgg,
      chickenEgg
    );

    expect(plumageChick).toEqual({ type: 'chicken', days: 0, plumage: true });
    expect(finePlumageChick).toEqual({
      type: 'chicken',
      days: 0,
      plumage: 'fine'
    });
  });

  test('the order of tools is relevant', () => {
    const plumageEgg = ({ tool }) =>
      tool('withPlumage', bird => ({ ...bird, plumage: true }));

    const finePlumageEgg = ({ tool }) =>
      tool('withPlumage', bird => ({ ...bird, plumage: 'fine' }));

    const chickenEgg = ({ breed, withPlumage }) =>
      breed('chick', () => withPlumage({ type: 'chicken', days: 0 }));

    const { chick: finePlumageChick } = hatch(
      plumageEgg,
      finePlumageEgg,
      chickenEgg
    );
    const { chick: backwardsPlumageChick } = hatch(
      plumageEgg,
      chickenEgg,
      finePlumageEgg
    );

    expect(finePlumageChick).toEqual({
      type: 'chicken',
      days: 0,
      plumage: 'fine'
    });
    expect(backwardsPlumageChick).toEqual({
      type: 'chicken',
      days: 0,
      plumage: true
    });
  });

  test('use previous tools to redefine current ones', () => {
    const birdEgg = ({ tool, breed }) => {
      let birdType = 'chicken';
      tool('withBirdType', newType => (birdType = newType));

      breed('bird', () => ({ type: birdType, days: 0 }));
    };

    const prettierBirdEgg = ({ tool, withBirdType }) => {
      tool('withBirdType', type => withBirdType(`pretty ${type}`));
    };

    const birdsAreDucksEgg = ({ withBirdType }) => {
      withBirdType('duck');
    };

    const { bird } = hatch(birdEgg, prettierBirdEgg, birdsAreDucksEgg);

    expect(bird).toEqual({ type: 'pretty duck', days: 0 });
  });
});

describe('error detection', () => {
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
  `('hatch fails if a tool name is not valid, case <$name>', ({ name }) => {
    const egg = ({ tool }) => tool(name);

    expect(() => hatch(egg)).toThrow(
      /invalid tool name, expected the first argument to be a non-empty string but received/
    );
  });

  test('hatch fails if an egg tries to change its input object', () => {
    const egg = input => {
      input.illegalChange = true;
    };

    expect(() => hatch(egg)).toThrow();
  });
});
