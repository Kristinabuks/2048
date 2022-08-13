function buildTranspose(dir, n) {
  switch (dir) {
    case 'left':
      return (i, j) => ({ i, j })
    case 'right':
      return (i, j) => ({ i, j: n - 1 - j })
    case 'up':
      return (i, j) => ({ i: j, j: i })
    case 'down':
      return (i, j) => ({ i: n - 1 - j, j: i })
  }
}


function step2048(m, dir) {
  const mergeBorders = [0, 0, 0, 0]
  while (!step2048iteration(m, dir, mergeBorders));
  //await animator.AnimateQueue()
}

function step2048iteration(m, dir, mergeBorders) {
  const n = m.length;
  const transpose = buildTranspose(dir, n)
  let isFinal = true

  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j++) {
      let { i: ai, j: aj } = transpose(i, j)

      if (m[ai][aj] === 0) {
        continue
      }

      let { i: pai, j: paj } = transpose(i, j - 1) // previous cell

      if (m[pai][paj] === 0) {
        m[pai][paj] = m[ai][aj]
        m[ai][aj] = 0
        isFinal = false
        //animator.Enqueue(moveAnimation(dir))
      } else if (m[pai][paj] === m[ai][aj] && mergeBorders[i] < j) {
        m[pai][paj] += m[ai][aj]
        m[ai][aj] = 0
        mergeBorders[i] = j;
        isFinal = false
        //animator.Enqueue(mergeAnimation(dir))
      }
    }
  }

  return isFinal
}


export {
  step2048
}