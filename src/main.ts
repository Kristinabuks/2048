import * as PIXI from "pixi.js";
import { FONT_FAMILY } from "./Config";
import { AnimationLoop } from "./AnimationLoop";
import { GameDrawer } from "./GameDrawer";
import { GameScore } from "./GameScore";
import {
  addRandomField,
  buildGrid,
  checkFinal,
  GameGrid,
  step2048,
} from "./Logic";
import { getKeyboardDirection } from "./Consts";

function bindKeyboardListener(
  grid: GameGrid,
  drawer: GameDrawer,
  animLoop: AnimationLoop,
  score: GameScore
) {
  async function onKeyDown(key: KeyboardEvent) {
    animLoop.cancel();

    const dir = getKeyboardDirection(key);
    if (!dir) {
      return;
    }

    if (await step2048(score, grid, dir, animLoop)) {
      addRandomField(grid, drawer);
    }

    if (checkFinal(grid)) {
      document.removeEventListener("keydown", onKeyDown);
      drawer.drawGameOver();
    }
  }

  document.addEventListener("keydown", onKeyDown);
}

async function main() {
  const gridContainer = document.getElementById("game-grid");
  const app = new PIXI.Application({
    antialias: true,
    resizeTo: gridContainer,
  });
  const grid = buildGrid();
  const score = new GameScore();
  const drawer = new GameDrawer(app);
  const animLoop = new AnimationLoop(drawer);

  PIXI.BitmapFont.from(FONT_FAMILY, {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
  });

  score.update(0);

  gridContainer.appendChild(app.view);

  bindKeyboardListener(grid, drawer, animLoop, score);

  drawer.drawBackground();

  addRandomField(grid, drawer);
}

main();
