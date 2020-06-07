import hatch from '../';

test('add tools to enable more tools to the following eggs', () => {
  function familyEgg({ breed, tool }) {
    const family = [];
    tool('addMember', (member) => family.push(member));
    breed('family', () => family);
  }

  function chickenEgg({ addMember }) {
    addMember({ type: 'chicken' });
  }

  const { family } = hatch(familyEgg, chickenEgg);
  expect(family).toEqual([{ type: 'chicken' }]);
});

test('use tools to mutate breeds before hatching', () => {
  const birdEgg = ({ tool, breed }) => {
    let birdType = 'chicken';
    tool('withBirdType', (newType) => (birdType = newType));

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
    function familyEgg({ breed, tool }) {
      const family = [];
      tool('addMember', (member) => family.push(member));
      breed('family', () => family);
    }

    function familyEndEgg({ tool }) {
      tool('addMember', () => {});
    }

    function chickenEgg({ addMember }) {
      addMember({ type: 'chicken' });
    }

    const { family } = hatch(familyEgg, familyEndEgg, chickenEgg);
    expect(family).toEqual([]);
  });

  test('the order of tools is relevant', () => {
    function familyEgg({ breed, tool }) {
      const family = [];
      tool('addMember', (member) => family.push(member));
      breed('family', () => family);
    }

    function familyEndEgg({ tool }) {
      tool('addMember', () => {});
    }

    function chickenEgg({ addMember }) {
      addMember({ type: 'chicken' });
    }

    const { family } = hatch(familyEndEgg, familyEgg, chickenEgg);
    expect(family).toEqual([{ type: 'chicken' }]);
  });

  test('use previous tools to redefine current ones', () => {
    function familyEgg({ breed, tool }) {
      const family = [];
      tool('addMember', (member) => family.push(member));
      breed('family', () => family);
    }

    function prettyEgg({ tool, addMember }) {
      tool('addMember', (member) => addMember({ ...member, pretty: true }));
    }

    function chickenEgg({ addMember }) {
      addMember({ type: 'chicken' });
    }

    const { family } = hatch(familyEgg, prettyEgg, chickenEgg);
    expect(family).toEqual([{ type: 'chicken', pretty: true }]);
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
    const egg = (input) => {
      input.illegalChange = true;
    };

    expect(() => hatch(egg)).toThrow();
  });
});
