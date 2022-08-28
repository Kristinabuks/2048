import { N } from "./config";

function buildTranspose(dir) {
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

function checkFinal(mat) {
  let isFinal = true;
  let dirs = ["left", "right", "up", "down"];

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

export { checkFinal };
