import { CombinedAnimator, IAnimator } from "./Animator";
import { GameScore } from "./GameScore";
import { N } from "./Config";
import { AnimationLoop } from "./AnimationLoop";
import { GameDrawer } from "./GameDrawer";

interface IElement {
  i: number;
  j: number;
  value?: number;
}

type GameGrid = IElement[][];

function buildGrid(): GameGrid {
  const grid = [];

  for (let i = 0; i < N; i++) {
    const row = [];

    for (let j = 0; j < N; j++) {
      row.push({ i, j, value: 0 });
    }

    grid.push(row);
  }

  return grid;
}

function buildTranspose(dir: string): (i: number, j: number) => IElement {
  switch (dir) {
    case "left":
      return (i, j) => ({ i, j });
    case "right":
      return (i, j) => ({ i, j: N - 1 - j });
    case "up":
      return (i, j) => ({ i: j, j: i });
    case "down":
      return (i, j) => ({ i: N - 1 - j, j: i });
  }
}

function checkFinal(mat: GameGrid) {
  let isFinal: boolean = true;
  let dirs: Array<string> = ["left", "right", "up", "down"];

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (mat[i][j].value === 0) {
        isFinal = false;
      }
    }
  }

  if (isFinal) {
    for (let dir of dirs) {
      const transpose = buildTranspose(dir);

      for (let i = 0; i < N; i++) {
        for (let j = 1; j < N; j++) {
          const { i: ai, j: aj } = transpose(i, j);
          const { i: pai, j: paj } = transpose(i, j - 1);

          if (mat[pai][paj].value === mat[ai][aj].value) {
            isFinal = false;
          }
        }
      }
    }
  }

  return isFinal;
}

async function step2048(
  score: GameScore,
  grid: GameGrid,
  dir: string,
  animLoop: AnimationLoop
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

function setupGrid(grid: GameGrid) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      grid[i][j] = { ...grid[i][j], i, j };
    }
  }
}

function animateDiff(grid: GameGrid): IAnimator[] {
  const animations: IAnimator[] = [];
  for (let di = 0; di < N; di++) {
    for (let dj = 0; dj < N; dj++) {
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
): IAnimator {
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
  grid: GameGrid,
  dir: string,
  mergeBorders: Array<number>
) {
  const transpose = buildTranspose(dir);
  let isFinal: boolean = true;

  for (let i = 0; i < N; i++) {
    for (let j = 1; j < N; j++) {
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

function addRandomField(grid: GameGrid, drawer: GameDrawer) {
  const [field, ok] = canAddRandomField(grid);

  if (ok) {
    const { i, j, value } = field;

    drawer.drawCell(i, j, value);
  }
}

function canAddRandomField(grid: GameGrid): [IElement, boolean] {
  const set: Set<[number, number]> = new Set();

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      if (grid[i][j].value === 0) {
        set.add([i, j]);
      }
    }
  }

  if (!set.size) {
    return [null, false];
  }

  const arr: Array<[number, number]> = Array.from(set);
  const field: number = Math.floor(Math.random() * arr.length);
  const [i, j]: [number, number] = arr[field];

  grid[i][j] = { i, j, value: 2 };

  return [grid[i][j], true];
}

export { checkFinal, addRandomField, step2048, buildGrid, GameGrid };
