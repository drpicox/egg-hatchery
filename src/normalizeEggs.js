function normalizeEggs(...eggs) {
  const eggsSet = new Set();

  function addEggs(nextEggs) {
    for (let i = 0; i < nextEggs.length; i++)
      if (Array.isArray(nextEggs[i])) addEggs(nextEggs[i]);
      else eggsSet.add(nextEggs[i]);
  }

  addEggs(eggs);

  return [...eggsSet];
}

export default normalizeEggs;
