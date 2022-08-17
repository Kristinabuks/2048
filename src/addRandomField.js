function addRandomField(mat) {
  let set = new Set();
  let n = mat.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (mat[i][j] === 0) {
        set.add([i, j])
      }
    }
  }
  if (set.size) {
    let arr = Array.from(set);
    let field = Math.floor(Math.random() * arr.length)
    let [i, j] = arr[field]
    mat[i][j] = 2;
  }

}

export {
  addRandomField
}