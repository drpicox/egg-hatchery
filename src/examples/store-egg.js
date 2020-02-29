import { applyMiddleware, createStore, combineReducers } from 'redux';

export default function storeEgg({ tool, breed }) {
  const reducers = {};
  const middleware = [];

  tool('combineReducer', (name, reducer) => {
    reducers[name] = reducer;
  });

  tool('addMiddleware', oneMiddleware => {
    middleware.push(oneMiddleware);
  });

  breed('store', () =>
    createStore(combineReducers(reducers), applyMiddleware(...middleware))
  );
}
