import counterEgg, { getCount, INCREMENT } from './counter-egg';

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
      break;
    default:
  }
};

function fiveEgg({ combineReducer, addMiddleware }) {
  combineReducer('@my/five', fiveReducer);
  addMiddleware(fiveMiddleware);
}

export default [counterEgg, fiveEgg];
