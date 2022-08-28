function addRandomField(grid) {
  const set = new Set();
  const n = grid.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j].value === 0) {
        set.add([i, j]);
      }
    }
  }

  if (!set.size) {
    return [{}, false];
  }

  const arr = Array.from(set);
  const field = Math.floor(Math.random() * arr.length);
  const [i, j] = arr[field];

  grid[i][j] = { i, j, value: 2 };

  return [grid[i][j], true];
}

export { addRandomField };
