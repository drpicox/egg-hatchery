import newBreedEgg from './newBreedEgg';
import newTools from './newTools';
import normalizeEggs from './normalizeEggs';

function validateEggs(eggs) {
  for (let i = 0; i < eggs.length; i++)
    if (typeof eggs[i] !== 'function')
      throw new Error(
        `received egg is not an egg, expected a function but received "${eggs[i]}"`
      );
}

function hatchEggs(eggs, tools) {
  for (let i = 0; i < eggs.length; i++) eggs[i](tools);
}

export default function hatch(...eggs) {
  const [tools, hatched] = newTools();
  const [breedEgg, getBreeds] = newBreedEgg();
  const uniqueEggs = normalizeEggs(breedEgg, eggs);

  validateEggs(uniqueEggs);
  hatchEggs(uniqueEggs, tools);

  const breeds = getBreeds();
  hatched();

  return breeds;
}
