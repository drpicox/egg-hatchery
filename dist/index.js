"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hatch;

var _breedEgg = _interopRequireDefault(require("./breedEgg"));

var _newTools = _interopRequireDefault(require("./newTools"));

var _normalizeEggs = _interopRequireDefault(require("./normalizeEggs"));

function validateEggs(eggs) {
  for (let i = 0; i < eggs.length; i++) if (typeof eggs[i] !== 'function') throw new Error(`received egg is not an egg, expected a function but received "${eggs[i]}"`);
}

function hatchEggs(eggs, tools) {
  for (let i = 0; i < eggs.length; i++) eggs[i](tools);
}

function hatch(...eggs) {
  const tools = (0, _newTools.default)();
  const uniqueEggs = (0, _normalizeEggs.default)(_breedEgg.default, eggs);
  validateEggs(uniqueEggs);
  hatchEggs(uniqueEggs, tools);
  const breeds = tools.breeds;
  tools.tool('isHatched', true);
  return breeds;
}