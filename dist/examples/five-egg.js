"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getFives = exports.FIVE = void 0;

var _counterEgg = _interopRequireWildcard(require("./counter-egg"));

const FIVE = '@my/counter/FIVE';
exports.FIVE = FIVE;

const getFives = ({
  '@my/five': five
}) => five;

exports.getFives = getFives;

const five = () => ({
  type: FIVE
});

function fiveReducer(state = 0, action) {
  switch (action.type) {
    case FIVE:
      return state + 1;

    default:
      return state;
  }
}

const fiveMiddleware = store => next => action => {
  next(action);

  switch (action.type) {
    case _counterEgg.INCREMENT:
      if ((0, _counterEgg.getCount)(store.getState()) % 5 === 0) store.dispatch(five());
      break;

    default:
  }
};

function fiveEgg({
  combineReducer,
  addMiddleware
}) {
  combineReducer('@my/five', fiveReducer);
  addMiddleware(fiveMiddleware);
}

var _default = [_counterEgg.default, fiveEgg];
exports.default = _default;