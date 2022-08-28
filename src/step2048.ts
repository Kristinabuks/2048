// @ts-ignore
import { CombinedAnimator } from "./animator.ts";
import { GameScore } from "./game";

function buildTranspose(dir: string, n: number) {
  switch (dir) {
    case "left":
      return (i: number, j: number) => ({ i, j });
    case "right":
      return (i: number, j: number) => ({ i, j: n - 1 - j });
    case "up":
      return (i: number, j: number) => ({ i: j, j: i });
    case "down":
      return (i: number, j: number) => ({ i: n - 1 - j, j: i });
  }
}

interface IElement {
  i: number;
  j: number;
  value: number;
}

type GameGrid = IElement[][];

interface IAnimationLoop {
  run(animations: CombinedAnimator[]): void;
  cancel(): void;
}

async function step2048(
  score: GameScore,
  grid: GameGrid,
  dir: string,
  animLoop: IAnimationLoop
) {
  const mergeBorders: number[] = [0, 0, 0, 0];
  let isFirstIter: boolean = true;

  setupGrid(grid);

  while (1) {
    let isFinal = step2048iteration(score, grid, dir, mergeBorders);
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

function setupGrid(grid: Array<Array<IElement>>) {
  const n: number = grid.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      grid[i][j] = { ...grid[i][j], i, j };
    }
  }
}

function animateDiff(grid: Array<Array<IElement>>) {
  const animations: Array<CombinedAnimator> = [];
  const n: number = grid.length;
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

function linearMotion(
  si: number,
  sj: number,
  di: number,
  dj: number,
  value: number
) {
  // FIXME: хак, чтобы не исчезали
  const dist: number = Math.max(((di - si) ** 2 + (dj - sj) ** 2) ** 0.5, 1);
  const dur: number = 5 * dist;

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

function step2048iteration(
  score: GameScore,
  grid: Array<Array<IElement>>,
  dir: string,
  mergeBorders: Array<number>
) {
  const n: number = grid.length;
  const transpose = buildTranspose(dir, n);
  let isFinal: boolean = true;

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

        score.update(grid[pai][paj].value);

        mergeBorders[i] = j;
        isFinal = false;
      }
    }
  }

  return isFinal;
}

export { step2048 };
