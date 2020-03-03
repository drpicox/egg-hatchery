"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = counterEgg;
exports.getCount = exports.increment = exports.INCREMENT = void 0;
const INCREMENT = '@my/counter/INCREMENT';
exports.INCREMENT = INCREMENT;

const increment = () => ({
  type: INCREMENT
});

exports.increment = increment;

const getCount = ({
  '@my/counter': counter
}) => counter;

exports.getCount = getCount;

function counterReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;

    default:
      return state;
  }
}

function counterEgg({
  combineReducer
}) {
  combineReducer('@my/counter', counterReducer);
}