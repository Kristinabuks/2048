function addRandomField(grid) {
  let set = new Set();
  let n = grid.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j].value === 0) {
        set.add([i, j]);
      }
    }
  }
  if (!set.size) {
    return [{}, false]
  }

  let arr = Array.from(set);
  let field = Math.floor(Math.random() * arr.length);
  let [i, j] = arr[field];
  grid[i][j] = { i, j, value: 2 };

  return [grid[i][j], true]
}

export { addRandomField };
