"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = storeEgg;

var _redux = require("redux");

function storeEgg({
  tool,
  breed
}) {
  const reducers = {};
  const middleware = [];
  tool('combineReducer', (name, reducer) => {
    reducers[name] = reducer;
  });
  tool('addMiddleware', oneMiddleware => {
    middleware.push(oneMiddleware);
  });
  breed('store', () => (0, _redux.createStore)((0, _redux.combineReducers)(reducers), (0, _redux.applyMiddleware)(...middleware)));
}