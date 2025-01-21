export const getRandomPfp = (layers) => {
  const selectedTraits = [];
  for (const layer of layers) {
    selectedTraits.push(layer.items[Math.floor(Math.random() * layer.items.length)]);
  }

  return selectedTraits;
};
