import hatch from '../';

test('isHatched is false while hatching', () => {
  let foundIsHatched;

  const anEgg = tools => {
    foundIsHatched = tools.isHatched;
  };
  hatch(anEgg);

  expect(foundIsHatched).toBe(false);
});

test('isHatched is true while breeding', () => {
  let foundIsHatched;

  const anEgg = tools => {
    tools.breed('a', () => {
      foundIsHatched = tools.isHatched;
      return 1;
    });
  };

  const { a } = hatch(anEgg);
  expect(a).toEqual(1);
  expect(foundIsHatched).toBe(true);
});

test('isHatched is true after hatch', () => {
  let foundTools;
  const anEgg = tools => {
    foundTools = tools;
  };

  hatch(anEgg);
  expect(foundTools.isHatched).toBe(true);
});

test('tool fails if isHatched', () => {
  let foundTools;
  const anEgg = tools => {
    foundTools = tools;
  };

  hatch(anEgg);

  expect(() => foundTools.tool('newTool', () => {})).toThrow(
    /cannot define more tools once the egg is hatched/
  );
});
