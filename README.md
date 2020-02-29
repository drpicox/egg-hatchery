<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Egg Hatchery 🐣](#egg-hatchery-)
  - [Redux](#redux)
  - [How an egg works?](#how-an-egg-works)
  - [How the redux-egg works?](#how-the-redux-egg-works)
  - [Why are eggs better than ducks?](#why-are-eggs-better-than-ducks)
    - [REASON 1: Combine eggs and solve dependencies](#reason-1-combine-eggs-and-solve-dependencies)
    - [REASON 2: Thunks sucks](#reason-2-thunks-sucks)
    - [REASON 3: They are still ducks](#reason-3-they-are-still-ducks)
  - [More than redux](#more-than-redux)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Egg Hatchery 🐣

> 🥚 Eggs are the new 🦆 ducks.

```javascript
import hatch from 'egg-hatchery';
import reduxEgg from 'redux-egg';
import counterEgg, { increment, getCount } from '@my/counter-egg';

test('counter egg increments in one', () => {
  const { store } = hatch(reduxEgg, counterEgg);
  store.dispatch(increment());
  expect(getCount(store.getState())).toBe(1);
});
```

## Redux

Please, refer to the [redux-egg](https://github.com/drpicox/redux-egg)
to know how redux works with eggs.

- https://github.com/drpicox/redux-egg/README.md

## How an egg works?

An egg is function that receives an object with tools.
Use those tools to create your eggs.

```javascript
export const INCREMENT = '@my/counter/INCREMENT';
export const increment = () => ({ type: INCREMENT });
export const getCount = ({ '@my/counter': counter }) => counter;

function counterReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1;
    default:
      return state;
  }
}

export default function counterEgg({ combineReducer }) {
  combineReducer('@my/counter', counterReducer);
}
```

## How the redux-egg works?

The most simple redux-egg should look like:

```javascript
import { createStore, combineReducers } from 'redux';

export default function storeEgg({ tool, breed }) {
  const reducers = {};

  tool('combineReducer', (name, reducer) => {
    reducers[name] = reducer;
  });

  breed('store', () => createStore(combineReducers(reducers)));
}
```

## Why are eggs better than ducks?

### REASON 1: Combine eggs and solve dependencies

Dependencies are hard with ducks.
Each duck is independent and must be configured independently.
The user of the duck must know its dependencies and any change will break
an existing application.

But eggs solve the dependencies by themselves.
Their use ages of human thinking about what comes first ducks or eggs
and they conclude that dependency inversion is cool.
If you have a dependency just use it.

```javascript
import counterEgg, { INCREMENT } from 'counter-egg';

export const getParity = ({ '@my/parity': parity }) => parity;

function parityReducer(state = true, action) {
  switch (action.type) {
    case INCREMENT:
      return !state;
    default:
      return state;
  }
}

function parityEgg({ combineReducer }) {
  combineReducer('@my/parity', parityReducer);
}

export default [counterEgg, parityEgg];
```

And you can forgot to include the dependency in your app.

```javascript
import hatch from 'egg-hatchery';
import storeEgg from 'store-egg';
import { increment } from '@my/counter-egg';
import parityEgg, { getParity } from '@my/parity-egg';

test('the parity changes with increment', () => {
  const { store } = hatch(storeEgg, counterEgg, parityEgg);
  store.dispatch(increment());
  expect(getParity(store.getState())).toBe(false);
});
```

Or you can include it. It is not repeated.

```javascript
import hatch from 'egg-hatchery';
import storeEgg from 'store-egg';
import counterEgg, { increment, getCount } from '@my/counter-egg';
import parityEgg, { getParity } from '@my/parity-egg';

test('the parity is still correct when the counter egg is added twice', () => {
  const { store } = hatch(storeEgg, counterEgg, parityEgg);
  store.dispatch(increment());
  expect(getParity(store.getState())).toBe(false);
});
```

### REASON 2: Thunks sucks

Well, not exactly. There is one and only one reason to use a thunk: you need the state before dispatching a new action from a component. If you remember the redux connect, it does not inject the state into dispatcher properties. The thunk middleware gives you access to that state. That limitation was because of performance. Nowadays, you can use hooks, but they are still more efficient if you use thunks.

The problem is the frequent use of thunks: launch subsequent actions to complement the current one. We were all thrilled with the ping pong example, but it was a lousy example. When we do these kinds of concatenated actions, we are looking for repercussions of the current action. In our duck, thanks to action creators, we can decouple and maintain it easily. The problem is, what happens when we want to intercept an action from an external duck? We need to use middleware, a redux observable, a saga, or something similar, but ducks are not ready for them. Like the reducers, if a duck needs a middleware or an equivalent, we have to prepare it manually.

The fiveEgg:

```javascript
import counterEgg, { getCount, INCREMENT } from 'counter-egg';

export const FIVE = '@my/counter/FIVE';
export const getFives = ({ '@my/five': five }) => five;
const five = () => ({ type: FIVE });

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
    case INCREMENT:
      if (getCount(store.getState()) % 5 === 0) store.dispatch(five());
    default:
  }
};

function fiveEgg({ combineReducer, addMiddleware }) {
  combineReducer('@my/five', fiveReducer);
  addMiddleware(fiveMiddleware);
}

export default [counterEgg, fiveEgg];
```

And how your program would look:

```javascript
import hatch from 'egg-hatchery';
import storeEgg from 'store-egg';
import { increment } from '@my/counter-egg';
import fiveEgg, { getFives } from '@my/five-egg';

test('the five changes with increment', () => {
  const { store } = hatch(storeEgg, fiveEgg);
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  expect(getFives(store.getState())).toBe(1);
});
```

### REASON 3: They are still ducks

Well, they are almost ducks. There is only one change: instead of exporting by default, a reducer they export by default the egg. Everything else is the well-known old duck.

## More than redux

The egg-hatchery is more about redux: it is a first-order dependency injection library. Look tests for more details at:

- [egg](./src/__tests__/eggs.spec.js)
- [breed](./src/__tests__/breeds.spec.js)
- [tool](./src/__tests__/tools.spec.js)
- [the breeds object](./src/__tests__/breedsObject.spec.js)
- [rebreed](./src/__tests__/rebreed.spec.js)
- [isHatching](./src/__tests__/isHatching.spec.js)
