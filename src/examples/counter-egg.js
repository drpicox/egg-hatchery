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
