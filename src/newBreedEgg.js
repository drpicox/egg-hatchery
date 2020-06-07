const { defineProperty } = Object;

export default () => {
  let publicBreeds;
  const breedEgg = (tools) => {
    const { tool } = tools;

    const breeds = Object.create(null);
    const frozenBreeds = Object.freeze(Object.create(breeds));
    const factories = Object.create(null);

    function validateBreedContext() {
      if (tools.isHatched())
        throw new Error('breed a hatching breed fails when hatch is finished');
    }

    function validateBreedName(name) {
      if (!name || typeof name !== 'string')
        throw new Error(
          `invalid breed name, expected the first argument to be a non-empty string but received "${name}"`
        );
    }

    function validateBreedFactory(factory) {
      if (typeof factory !== 'function')
        throw new Error(
          `invalid breed function, expected the second argument to be a function but received "${factory}"`
        );
    }

    function breed(name, factory) {
      validateBreedContext();
      validateBreedName(name);
      validateBreedFactory(factory);

      const uberFactory = factories[name];
      const breedFactory = () => {
        if (!tools.isHatched())
          throw new Error('breeds object cannot be used until eggs hatch');

        defineProperty(breeds, name, { get: uberFactory, configurable: true });
        const value = factory(frozenBreeds);
        defineProperty(breeds, name, { value, configurable: true });

        return value;
      };

      factories[name] = breedFactory;

      defineProperty(breeds, name, {
        get: breedFactory,
        configurable: true,
      });
    }

    tool('breed', breed);
    publicBreeds = frozenBreeds;
  };

  const getBreeds = () => publicBreeds;
  return [breedEgg, getBreeds];
};
