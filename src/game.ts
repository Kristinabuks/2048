import * as PIXI from "pixi.js";
// @ts-ignore
import { CombinedAnimator } from "./animator.ts";
// @ts-ignore
import { step2048 } from "./step2048.ts";
// @ts-ignore
import { canAddRandomField } from "./addRandomField.ts";
import { checkFinal } from "./checkFinal";
import { FONT_FAMILY, N } from "./config";

function getKeyboardDirection(key: KeyboardEvent) {
  switch (key.key) {
    case "ArrowRight":
    case "d":
      return "right";
    case "ArrowLeft":
    case "a":
      return "left";
    case "ArrowUp":
    case "w":
      return "up";
    case "ArrowDown":
    case "s":
      return "down";
    default:
      return null;
  }
}

function getColorByValue(value: number): [number, number] {
  switch (value) {
    case 0:
      return [0xc34288, 0.3];
    case 2:
      return [0xc98fdb, 1];
    case 4:
      return [0xad69c2, 1];
    case 8:
      return [0x9e55b5, 1];
    case 16:
      return [0xa950b5, 1];
    case 32:
      return [0xb52cc7, 1];
    case 64:
      return [0x9c26ab, 1];
    case 128:
      return [0xc72cbf, 1];
    case 256:
      return [0xa813a1, 1];
    case 512:
      return [0x780173, 1];
    case 1024:
      return [0xcf1fa9, 1];
    case 2048:
      return [0xb0126b, 1];
    default:
      return [0xde1285, 1];
  }
}

class GameDrawer {
  app: PIXI.Application;
  constructor(app: PIXI.Application) {
    this.app = app;

    const splash: PIXI.Container = new PIXI.Container();
    splash.name = "splash";
    app.stage.addChild(splash);
    splash.addChild(PIXI.Sprite.from("sample.jpg"));

    const graphics = new PIXI.Graphics();
    graphics.name = "graphics";
    app.stage.addChild(graphics);

    const labels = new PIXI.Container();
    labels.name = "labels";
    app.stage.addChild(labels);
  }

  graphics(): PIXI.Graphics {
    return this.app.stage.getChildByName("graphics") as PIXI.Graphics;
  }

  labels(): PIXI.Container {
    return this.app.stage.getChildByName("labels") as PIXI.Container;
  }

  splash(): PIXI.Container {
    return this.app.stage.getChildByName("labels") as PIXI.Container;
  }

  drawBackground() {
    const labels = this.labels();
    const splash = this.splash();
    const graphics = this.graphics();

    splash.removeChildren();
    splash.addChild(PIXI.Sprite.from("sample.jpg"));
    graphics.clear();
    labels.removeChildren();

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        this.drawCell(i, j, 0);
      }
    }
  }

  drawCell(i: number, j: number, value: number) {
    const graphics = this.graphics();
    const labels = this.labels();
    const [color, opacity] = getColorByValue(value);

    const size = (this.app.resizeTo as HTMLElement).getBoundingClientRect()
      .width;
    const side = size / 5;
    const space = (size / 5) * 0.2;
    const x = (j + 1) * space + j * side;
    const y = (i + 1) * space + i * side;

    graphics.beginFill(color, opacity);
    graphics.drawRoundedRect(x, y, side, side, side * 0.15);
    graphics.endFill();

    if (value === 0) {
      return;
    }

    const bitmapText = new PIXI.BitmapText(String(value), {
      fontName: FONT_FAMILY,
      fontSize: value > 8192 ? size / 16 : size / 14,
    });
    bitmapText.x = x + side / 2;
    bitmapText.y = y + side / 2;
    bitmapText.anchor = new PIXI.Point(0.5, 0.5);
    labels.addChild(bitmapText);
  }

  drawFinal() {
    const splash = this.splash();
    const graphics = this.graphics();

    const resizeTo = this.app.resizeTo as HTMLElement;
    const size = resizeTo.getBoundingClientRect().width;

    graphics.beginFill(0xc34288, 0.5);
    graphics.drawRoundedRect(0, 0, size, size, 0.25);
    graphics.endFill();

    const basicText = new PIXI.BitmapText("Final", {
      fontName: FONT_FAMILY,
      fontSize: size / 10,
    });
    basicText.x = size / 2;
    basicText.y = size / 2;
    basicText.anchor = new PIXI.Point(0.5, 0.5);

    splash.addChild(basicText);
  }
}

class AnimationLoop {
  cancelAnim: Array<CombinedAnimator>;
  drawer: GameDrawer;

  constructor(drawer: GameDrawer) {
    this.cancelAnim = [];
    this.drawer = drawer;
  }

  async run(animations: Array<CombinedAnimator>) {
    const ticker = new PIXI.Ticker();

    this.cancelAnim = animations;

    await new Promise((resolve) => {
      ticker.add((dt) => {
        let finish = true;

        this.drawer.drawBackground();

        for (const anim of animations) {
          const { x: i, y: j, value } = anim.currentState();

          this.drawer.drawCell(i, j, value);

          if (anim.next(dt)) {
            finish = false;
          }
        }

        if (finish) {
          resolve(undefined);
        }
      });
      ticker.start();
    });

    ticker.destroy();
  }

  cancel() {
    for (const anim of this.cancelAnim) {
      anim.finalize();
    }
  }
}

interface IElement {
  i: number;
  j: number;
  value: number;
}

function buildGrid(): Array<Array<IElement>> {
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

class GameScore {
  gameScoreView: HTMLElement;
  score: number;

  constructor() {
    this.gameScoreView = document.getElementById("game-score");
    this.score = 0;
  }

  update(value: number) {
    this.score += value;
    this.gameScoreView.innerText = `Score:\xa0${this.score}`;
  }
}

async function pixi() {
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

function bindKeyboardListener(
  grid: Array<Array<IElement>>,
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
      drawer.drawFinal();
    }
  }

  document.addEventListener("keydown", onKeyDown);
}

function addRandomField(grid: Array<Array<IElement>>, drawer: GameDrawer) {
  const [field, ok] = canAddRandomField(grid);

  if (ok) {
    const { i, j, value } = field;

    drawer.drawCell(i, j, value);
  }
}

export { pixi, GameScore };
