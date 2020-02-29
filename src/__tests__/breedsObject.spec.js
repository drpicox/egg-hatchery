import hatch from '../';

test('you can get the breeds object before hatching', () => {
  let foundBreeds;
  const anEgg = ({ breed, breeds }) => {
    breed('a', () => 1);
    foundBreeds = breeds;
  };

  hatch(anEgg);

  expect(foundBreeds.a).toEqual(1);
});

test('hatch fails if you use breeds inside an egg but outside a breed', () => {
  let foundA;
  const anEgg = ({ breed, breeds }) => {
    breed('a', () => 1);
    foundA = breeds.a;
  };

  expect(() => hatch(anEgg)).toThrow(
    /breeds object cannot be used until eggs hatch/
  );
  expect(foundA).not.toEqual(1);
});

test('you can redefine breeds and you change the result of hatch (you not want to)', () => {
  const anEgg = ({ tool }) => {
    tool('breeds', { a: 1 });
  };

  const breeds = hatch(anEgg);

  expect(breeds.a).toEqual(1);
});

test('if you redefine breeds you have to redefine breed and rebreed, because they stop working', () => {
  const anEgg = ({ tool, breed }) => {
    tool('breeds', { a: 1 });
    breed('b', () => 2);
  };

  const breeds = hatch(anEgg);

  expect(breeds.a).toEqual(1);
  expect(breeds.b).toBeUndefined();
});
test('produce a new element using existing breeds', () => {
  const newFarmer = ({ chick }) => ({ type: 'farmer', chick });

  const farmEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
    breed('farm', breeds => ({
      farm: true,
      farmer: newFarmer(breeds)
    }));
  };

  const { farm } = hatch(farmEgg);
  expect(farm).toEqual({
    farm: true,
    farmer: { type: 'farmer', chick: { type: 'chicken', days: 0 } }
  });
});

test('use breeds afeter hatch', () => {
  const chickenEgg = ({ breed }) => {
    breed('chick', () => ({ type: 'chicken', days: 0 }));
  };
  const breeds = hatch(chickenEgg);

  const newFarmer = ({ chick }) => ({ type: 'farmer', chick });
  const farmer = newFarmer(breeds);
  expect(farmer).toEqual({
    type: 'farmer',
    chick: { type: 'chicken', days: 0 }
  });
});

test('breeds still works if hatch has no eggs', () => {
  const newChick = () => ({ type: 'chicken', days: 0 });
  const breeds = hatch();

  const chick = newChick(breeds);

  expect(chick).toEqual({ type: 'chicken', days: 0 });
});

test('breeds can be used again', () => {
  const newChick = () => ({ type: 'chicken', days: 0 });
  const newBarn = breeds => ({
    type: 'barn',
    animals: [newChick(breeds), newChick(breeds)]
  });
  const farmEgg = ({ breed }) => {
    breed('farm', breeds => ({ type: 'farm', barn: newBarn(breeds) }));
  };
  const { farm } = hatch(farmEgg);

  expect(farm).toEqual({
    type: 'farm',
    barn: {
      type: 'barn',
      animals: [
        { type: 'chicken', days: 0 },
        { type: 'chicken', days: 0 }
      ]
    }
  });
});
