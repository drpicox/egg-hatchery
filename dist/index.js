"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hatch;

var _newBreedEgg = _interopRequireDefault(require("./newBreedEgg"));

var _newTools = _interopRequireDefault(require("./newTools"));

var _normalizeEggs = _interopRequireDefault(require("./normalizeEggs"));

function validateEggs(eggs) {
  for (let i = 0; i < eggs.length; i++) if (typeof eggs[i] !== 'function') throw new Error(`received egg is not an egg, expected a function but received "${eggs[i]}"`);
}

function hatchEggs(eggs, tools) {
  for (let i = 0; i < eggs.length; i++) eggs[i](tools);
}

function hatch(...eggs) {
  const [tools, hatched] = (0, _newTools.default)();
  const [breedEgg, getBreeds] = (0, _newBreedEgg.default)();
  const uniqueEggs = (0, _normalizeEggs.default)(breedEgg, eggs);
  validateEggs(uniqueEggs);
  hatchEggs(uniqueEggs, tools);
  const breeds = getBreeds();
  hatched();
  return breeds;
}