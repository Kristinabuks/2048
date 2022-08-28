import { CombinedAnimator } from "./animator.ts";

function buildTranspose(dir, n) {
  switch (dir) {
    case "left":
      return (i, j) => ({ i, j });
    case "right":
      return (i, j) => ({ i, j: n - 1 - j });
    case "up":
      return (i, j) => ({ i: j, j: i });
    case "down":
      return (i, j) => ({ i: n - 1 - j, j: i });
  }
}

async function step2048(sumScore, grid, dir, animLoop) {
  const mergeBorders = [0, 0, 0, 0];
  let isFirstIter = true;

  setupGrid(grid);

  while (1) {
    let isFinal = step2048iteration(sumScore, grid, dir, mergeBorders);
    if (isFinal && isFirstIter) {
      return false;
    }
    isFirstIter = false;
    if (isFinal) {
      break;
    }
  }

  await animLoop.run(animateDiff(grid));

  return true;
}

function setupGrid(grid) {
  const n = grid.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      grid[i][j] = { ...grid[i][j], i, j };
    }
  }
}

function animateDiff(grid) {
  const animations = [];
  const n = grid.length;
  for (let di = 0; di < n; di++) {
    for (let dj = 0; dj < n; dj++) {
      const { i: si, j: sj, value } = grid[di][dj];
      if (value !== 0) {
        animations.push(linearMotion(si, sj, di, dj, value));
      }
    }
  }
  return animations;
}

function linearMotion(si, sj, di, dj, value) {
  // FIXME: хак, чтобы не исчезали
  const dist = Math.max(((di - si) ** 2 + (dj - sj) ** 2) ** 0.5, 1);
  const dur = 5 * dist;

  return new CombinedAnimator(
    {
      0: {
        x: si,
        y: sj,
        scale: 1,
        value,
      },
      1: {
        x: di,
        y: dj,
        scale: 1,
        value,
      },
    },
    dur
  );
}

function step2048iteration(sumScore, grid, dir, mergeBorders) {
  const n = grid.length;
  const transpose = buildTranspose(dir, n);
  let isFinal = true;

  for (let i = 0; i < n; i++) {
    for (let j = 1; j < n; j++) {
      let { i: ai, j: aj } = transpose(i, j);
      let { i: pai, j: paj } = transpose(i, j - 1); // previous cell

      if (grid[ai][aj].value === 0) {
        continue;
      }

      if (grid[pai][paj].value === 0) {
        grid[pai][paj] = { ...grid[ai][aj] };
        grid[ai][aj].value = 0;

        isFinal = false;
      } else if (
        grid[pai][paj].value === grid[ai][aj].value &&
        mergeBorders[i] < j
      ) {
        grid[pai][paj] = {
          ...grid[ai][aj],
          value: grid[ai][aj].value + grid[pai][paj].value,
        };
        grid[ai][aj].value = 0;

        sumScore(grid[pai][paj].value);

        mergeBorders[i] = j;
        isFinal = false;
      }
    }
  }

  return isFinal;
}

export { step2048 };
