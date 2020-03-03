"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = newTools;

function newTools() {
  const tools = Object.create(null);

  tools.tool = (name, value) => {
    if (!name || typeof name !== 'string') throw new Error(`invalid tool name, expected the first argument to be a non-empty string but received "${name}"`);
    if (tools.isHatched) throw new Error(`invalid state exception, cannot define more tools once the egg is hatched`);
    tools[name] = value;
  };

  tools.isHatched = false;
  const frozenTools = Object.freeze(Object.create(tools));
  return frozenTools;
}