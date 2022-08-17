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


async function step2048(sumScore, m, dir, animate) {
  const mergeBorders = [0, 0, 0, 0]
  let isFirstIter = true

  while (1) {
    let animations = []
    let isFinal = step2048iteration(sumScore, m, dir, mergeBorders, animations)
    if (isFinal && isFirstIter) {
      return false
    }
    isFirstIter = false
    await animate(animations)
    if (isFinal) {
      break
    }
  };
  
  return true
}

function moveAnimation(pos, dir) {
  return function(dt) {
    const { i, j, value } = pos
    let ppos
    switch (dir) {
      case 'left':
        if (j > 0) {
          ppos = { i, j: j - dt, value }
        } else {
          ppos = pos
        }
        break
      case 'right':
        if (j < 3) {
          ppos = { i, j: j + dt, value }
        } else {
          ppos = pos
        }
        break
      case 'up':
        if (i > 0) {
          ppos = { i: i - dt, j, value }
        } else {
          ppos = pos
        }
        break
      case 'down':
        if (i < 3) {
          ppos = { i: i + dt, j, value }
        } else {
          ppos = pos
        }
        break
    }
    pos = ppos
    return ppos
  }
}

function idleAnimation(pos) {
  return function(dt) {
    return pos
  }
}

function step2048iteration(sumScore, m, dir, mergeBorders, animations) {
  const n = m.length;
  const transpose = buildTranspose(dir, n)
  let isFinal = true

  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j++) {
      let { i: ai, j: aj } = transpose(i, j)
      let { i: pai, j: paj } = transpose(i, j - 1) // previous cell

      if (m[ai][aj] === 0) {
        if (m[pai][paj] !== 0) {
          animations.push(idleAnimation({ i: pai, j: paj, value: m[pai][paj] }))
        }
        continue
      }


      if (m[pai][paj] === 0) {
        m[pai][paj] = m[ai][aj]
        m[ai][aj] = 0
        isFinal = false
        animations.push(moveAnimation({ i: ai, j: aj, value: m[pai][paj] }, dir))
        //animator.Enqueue(moveAnimation(dir))
      } else if (m[pai][paj] === m[ai][aj] && mergeBorders[i] < j) {
        m[pai][paj] += m[ai][aj]
        sumScore(m[pai][paj])
        m[ai][aj] = 0
        mergeBorders[i] = j;
        isFinal = false
        animations.push(moveAnimation({ i: ai, j: aj, value: m[pai][paj] }, dir))
        //animator.Enqueue(mergeAnimation(dir))
      } else {
        animations.push(idleAnimation({ i: pai, j: paj, value: m[pai][paj] }))
      }
    }
  }

  return isFinal
}


export {
  step2048
}