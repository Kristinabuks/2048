interface IElement {
  i: number;
  j: number;
  value: number;
}

function canAddRandomField(grid: Array<Array<IElement>>) {
  const set: Set<[number, number]> = new Set();
  const n: number = grid.length;

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

  const arr: Array<[number, number]> = Array.from(set);
  const field: number = Math.floor(Math.random() * arr.length);
  const [i, j]: [number, number] = arr[field];

  grid[i][j] = { i, j, value: 2 };

  return [grid[i][j], true];
}

export { canAddRandomField };
