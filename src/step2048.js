import { CombinedAnimator } from "./animator.ts"


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

function linearMotion(ai, aj, bi, bj, value) {
  return new CombinedAnimator({
    0: {
        x: ai, 
        y: aj,
        scale: 1,
        value,
    },
    1: {
        x: bi, 
        y: bj,
        scale: 1,
        value,
    },
  }, 5)
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
          animations.push(linearMotion(pai, paj, pai, paj, m[pai][paj]))
        }
        continue
      }


      if (m[pai][paj] === 0) {
        m[pai][paj] = m[ai][aj]
        m[ai][aj] = 0
        isFinal = false
        animations.push(linearMotion(ai, aj, pai, paj, m[pai][paj]))
        
      } else if (m[pai][paj] === m[ai][aj] && mergeBorders[i] < j) {
        m[pai][paj] += m[ai][aj]
        sumScore(m[pai][paj])
        m[ai][aj] = 0
        mergeBorders[i] = j;
        isFinal = false
        animations.push(linearMotion(pai, paj, pai, paj, m[pai][paj]))
        
      } else {
        animations.push(linearMotion(pai, paj, pai, paj, m[pai][paj]))
      }
    }
  }

  return isFinal
}


export {
  step2048
}