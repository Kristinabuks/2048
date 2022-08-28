interface IElement {
    i: number
    j: number
    value: number
}

function addRandomField(grid: Array<Array<IElement>>) {
    let set:Set<[number, number]> = new Set();
    let n:number = grid.length;
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
  
    let arr:Array<[number, number]> = Array.from(set);
    let field:number = Math.floor(Math.random() * arr.length);
    let [i, j]:[number, number] = arr[field];
    grid[i][j] = { i, j, value: 2 };
  
    return [grid[i][j], true]
  }
  
  export { addRandomField };
  