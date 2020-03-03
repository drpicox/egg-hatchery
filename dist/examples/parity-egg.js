"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getParity = void 0;

var _counterEgg = _interopRequireWildcard(require("./counter-egg"));

const getParity = ({
  '@my/parity': parity
}) => parity;

exports.getParity = getParity;

function parityReducer(state = true, action) {
  switch (action.type) {
    case _counterEgg.INCREMENT:
      return !state;

    default:
      return state;
  }
}

function parityEgg({
  combineReducer
}) {
  combineReducer('@my/parity', parityReducer);
}

var _default = [_counterEgg.default, parityEgg];
exports.default = _default;