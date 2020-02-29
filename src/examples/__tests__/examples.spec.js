import hatch from "../../";
import storeEgg from "../store-egg";
import counterEgg, { increment, getCount } from "../counter-egg";
import parityEgg, { getParity } from "../parity-egg";
import fiveEgg, { getFives } from "../five-egg";

test("counter egg increments in one", () => {
  const { store } = hatch(storeEgg, counterEgg);
  store.dispatch(increment());
  expect(getCount(store.getState())).toBe(1);
});

test("the parity changes with increment", () => {
  const { store } = hatch(storeEgg, counterEgg, parityEgg);
  store.dispatch(increment());
  expect(getParity(store.getState())).toBe(false);
});

test("the parity is still correct when the counter egg is added twice", () => {
  const { store } = hatch(storeEgg, counterEgg, parityEgg);
  store.dispatch(increment());
  expect(getParity(store.getState())).toBe(false);
});

test("the five changes with increment", () => {
  const { store } = hatch(storeEgg, fiveEgg);
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  store.dispatch(increment());
  expect(getFives(store.getState())).toBe(1);
});
