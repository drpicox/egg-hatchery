'use strict';

var defineProperty = Object.defineProperty;
var newBreedEgg = (function () {
  var publicBreeds;

  var getBreeds = function () {
    return publicBreeds;
  };

  return [function breedEgg(tools) {
    var tool = tools.tool;
    var breeds = Object.create(null);
    var frozenBreeds = Object.freeze(Object.create(breeds));
    var factories = Object.create(null);

    function validateBreedContext() {
      if (tools.isHatched()) throw new Error('breed a hatching breed fails when hatch is finished');
    }

    function validateBreedName(name) {
      if (!name || typeof name !== 'string') throw new Error("invalid breed name, expected the first argument to be a non-empty string but received \"" + name + "\"");
    }

    function validateBreedFactory(factory) {
      if (typeof factory !== 'function') throw new Error("invalid breed function, expected the second argument to be a function but received \"" + factory + "\"");
    }

    tool('breed', function (name, factory) {
      validateBreedContext();
      validateBreedName(name);
      validateBreedFactory(factory);
      var uberFactory = factories[name];

      var breedFactory = function () {
        if (!tools.isHatched()) throw new Error('breeds object cannot be used until eggs hatch');
        defineProperty(breeds, name, {
          get: uberFactory,
          configurable: true
        });
        var value = factory(frozenBreeds);
        defineProperty(breeds, name, {
          value: value,
          configurable: true
        });
        return value;
      };

      factories[name] = breedFactory;
      defineProperty(breeds, name, {
        get: breedFactory,
        configurable: true
      });
    });
    publicBreeds = frozenBreeds;
  }, getBreeds];
});

function newTools() {
  var tools = Object.create(null);
  var isHatched = false;

  var checkIsHatched = function () {
    if (isHatched) throw new Error("invalid state exception, cannot use tools once the egg is hatched");
  };

  tools.tool = function (name, value) {
    if (!name || typeof name !== 'string') throw new Error("invalid tool name, expected the first argument to be a non-empty string but received \"" + name + "\"");
    checkIsHatched();

    if (typeof value === 'function') {
      var fn = value;

      value = function () {
        checkIsHatched();
        fn.apply(void 0, arguments);
      };
    }

    tools[name] = value;
  };

  tools.isHatched = function () {
    return isHatched;
  };

  var frozenTools = Object.freeze(Object.create(tools));
  return [frozenTools, function hatched() {
    return isHatched = true;
  }];
}

function normalizeEggs() {
  var eggsSet = new Set();

  function addEggs(nextEggs) {
    for (var i = 0; i < nextEggs.length; i++) {
      if (Array.isArray(nextEggs[i])) addEggs(nextEggs[i]);else eggsSet.add(nextEggs[i]);
    }
  }

  for (var _len = arguments.length, eggs = new Array(_len), _key = 0; _key < _len; _key++) {
    eggs[_key] = arguments[_key];
  }

  addEggs(eggs);
  return [].concat(eggsSet);
}

function validateEggs(eggs) {
  for (var i = 0; i < eggs.length; i++) {
    if (typeof eggs[i] !== 'function') throw new Error("received egg is not an egg, expected a function but received \"" + eggs[i] + "\"");
  }
}

function hatchEggs(eggs, tools) {
  for (var i = 0; i < eggs.length; i++) {
    eggs[i](tools);
  }
}

function hatch() {
  var _newTools = newTools(),
      tools = _newTools[0],
      hatched = _newTools[1];

  var _newBreedEgg = newBreedEgg(),
      breedEgg = _newBreedEgg[0],
      getBreeds = _newBreedEgg[1];

  for (var _len = arguments.length, eggs = new Array(_len), _key = 0; _key < _len; _key++) {
    eggs[_key] = arguments[_key];
  }

  var uniqueEggs = normalizeEggs(breedEgg, eggs);
  validateEggs(uniqueEggs);
  hatchEggs(uniqueEggs, tools);
  var breeds = getBreeds();
  hatched();
  return breeds;
}

module.exports = hatch;
