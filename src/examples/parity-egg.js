import counterEgg, { INCREMENT } from './counter-egg';

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
