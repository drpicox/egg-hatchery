(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.EggHatchery = factory());
}(this, (function () { 'use strict';

  var defineProperty = Object.defineProperty;
  var breedEgg = (function (tools) {
    var tool = tools.tool;
    var breeds = Object.create(null);
    var frozenBreeds = Object.freeze(Object.create(breeds));
    var factories = Object.create(null);

    function validateBreedContext() {
      if (tools.isHatched) throw new Error('breed a hatching breed fails when hatch is finished');
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
      var localBreeds = Object.create(breeds);
      defineProperty(localBreeds, name, {
        get: uberFactory
      });
      Object.freeze(localBreeds);
      var isComputed = false;
      var isComputing = false;
      var memoizedValue;

      var breedFactory = function () {
        if (!tools.isHatched) throw new Error('breeds object cannot be used until eggs hatch');
        if (isComputed) return memoizedValue;
        if (isComputing) throw new Error("breed cycle detected, it uses breeds that uses \"" + name + "\"");
        isComputing = true;
        memoizedValue = factory(localBreeds);
        isComputed = true;
        return memoizedValue;
      };

      factories[name] = breedFactory;
      defineProperty(breeds, name, {
        get: breedFactory,
        configurable: true
      });
    });
    tool('breeds', frozenBreeds);
  });

  function newTools() {
    var tools = Object.create(null);

    tools.tool = function (name, value) {
      if (!name || typeof name !== 'string') throw new Error("invalid tool name, expected the first argument to be a non-empty string but received \"" + name + "\"");
      if (tools.isHatched) throw new Error("invalid state exception, cannot define more tools once the egg is hatched");
      tools[name] = value;
    };

    tools.isHatched = false;
    var frozenTools = Object.freeze(Object.create(tools));
    return frozenTools;
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
    var tools = newTools();

    for (var _len = arguments.length, eggs = new Array(_len), _key = 0; _key < _len; _key++) {
      eggs[_key] = arguments[_key];
    }

    var uniqueEggs = normalizeEggs(breedEgg, eggs);
    validateEggs(uniqueEggs);
    hatchEggs(uniqueEggs, tools);
    var breeds = tools.breeds;
    tools.tool('isHatched', true);
    return breeds;
  }

  return hatch;

})));
//# sourceMappingURL=egg-hatchery.umd.js.map
