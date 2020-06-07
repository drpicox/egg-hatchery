"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newTools;

function newTools() {
  const tools = Object.create(null);
  let isHatched = false;

  const checkIsHatched = () => {
    if (isHatched) throw new Error(`invalid state exception, cannot use tools once the egg is hatched`);
  };

  tools.tool = (name, value) => {
    if (!name || typeof name !== 'string') throw new Error(`invalid tool name, expected the first argument to be a non-empty string but received "${name}"`);
    checkIsHatched();

    if (typeof value === 'function') {
      const fn = value;

      value = (...args) => {
        checkIsHatched();
        fn(...args);
      };
    }

    tools[name] = value;
  };

  tools.isHatched = () => isHatched;

  const frozenTools = Object.freeze(Object.create(tools));
  return [frozenTools, () => isHatched = true];
}