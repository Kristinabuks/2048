import * as PIXI from "pixi.js";
import { checkFinal } from "./checkFinale";
// @ts-ignore
import { CombinedAnimator } from "./animator.ts";
// @ts-ignore
import { step2048 } from "./step2048.ts";
// @ts-ignore
import { addRandomField } from "./addRandomField.ts";

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
  app: PIXI.Application
  constructor(app: PIXI.Application) {
    this.app = app

    const splash: PIXI.Container = new PIXI.Container()
    splash.name = "splash"
    app.stage.addChild(splash);
    splash.addChild(PIXI.Sprite.from("sample.jpg"))

    const graphics = new PIXI.Graphics();
    graphics.name = "graphics"
    app.stage.addChild(graphics);

    const labels = new PIXI.Container();
    labels.name = "labels"
    app.stage.addChild(labels);
  }

  graphics(): PIXI.Graphics {
    return this.app.stage.getChildByName("graphics") as PIXI.Graphics
  }

  labels(): PIXI.Container {
    return this.app.stage.getChildByName("labels") as PIXI.Container
  }

  splash(): PIXI.Container {
    return this.app.stage.getChildByName("labels") as PIXI.Container
  }

  drawBackground() {
    const splash = this.splash()
    splash.removeChildren()
    splash.addChild(PIXI.Sprite.from("sample.jpg"))

    const graphics = this.graphics()
    graphics.clear()

    const labels = this.labels()
    labels.removeChildren()

    const n = 4;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        this.drawCell(i, j, 0)
      }
    }
  }

  drawCell(i: number, j: number, value: number) {
    const graphics = this.graphics()

    const resizeTo = this.app.resizeTo as HTMLElement
    const size = resizeTo.getBoundingClientRect().width;
    const side = size / 5;
    const space = (size / 5) * 0.2;
    const x = (j + 1) * space + j * side;
    const y = (i + 1) * space + i * side;

    const [color, opacity] = getColorByValue(value)
    graphics.beginFill(color, opacity);
    graphics.drawRoundedRect(x, y, side, side, side * 0.15);
    graphics.endFill();

    if (value === 0) {
      return
    }

    const labels = this.labels()
    const basicText = new PIXI.BitmapText(
      String(value),
      { fontName: FONT_FAMILY, fontSize: value > 8192 ? size / 16 : size / 14 }
    );
    basicText.x = x + side / 2;
    basicText.y = y + side / 2;
    basicText.anchor = new PIXI.Point(0.5, 0.5)
    labels.addChild(basicText);
  }

  drawFinal() {
    const splash = this.splash()
    const graphics = this.graphics()

    const resizeTo = this.app.resizeTo as HTMLElement
    const size = resizeTo.getBoundingClientRect().width;

    graphics.beginFill(0xc34288, 0.5);
    graphics.drawRoundedRect(0, 0, size, size, 0.25);
    graphics.endFill();

    const basicText = new PIXI.BitmapText(
      'Final',
      { fontName: FONT_FAMILY, fontSize: size / 10 }
    );
    basicText.x = size / 2;
    basicText.y = size / 2;
    basicText.anchor = new PIXI.Point(0.5, 0.5)

    splash.addChild(basicText);
  }
}

class AnimationLoop {
  animations: Array<CombinedAnimator>
  drawer: GameDrawer
  constructor(drawer: GameDrawer) {
    this.animations = []
    this.drawer = drawer
  }

  async run(animations: Array<CombinedAnimator>) {
    this.animations = animations

    const ticker = new PIXI.Ticker();

    await new Promise((resolve) => {
      ticker.add((dt) => {
        this.drawer.drawBackground()
        let finish = true
        for (const anim of animations) {
          const { x: i, y: j, value } = anim.currentState();
          this.drawer.drawCell(i, j, value)
          if (anim.next(dt)) {
            finish = false
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
    for (const anim of this.animations) {
      anim.finalize()
    }
  }
}

interface IElement {
  i: number
  j: number
  value: number
}

function buildGrid(): Array<Array<IElement>> {
  const grid = []
  const n = 4
  for (let i = 0; i < n; i++) {
    const row = []
    for (let j = 0; j < n; j++) {
      row.push({ i, j, value: 0 })
    }
    grid.push(row)
  }
  return grid
}

const FONT_FAMILY = "Open Sans"

async function pixi() {
  let score = 0;

  const gridContainer = document.getElementById("game-grid");

  let app = new PIXI.Application({
    antialias: true,
    resizeTo: gridContainer,
  });

  PIXI.BitmapFont.from(FONT_FAMILY, {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
  });
  gridContainer.appendChild(app.view);

  const grid = buildGrid();

  const scoreContainer = document.getElementById("game-score");

  function sumScore(number: number) {
    score += number;
    scoreContainer.innerText = `Score:\xa0${score}`;
  }

  sumScore(0)

  let isFinal = false;

  document.addEventListener("keydown", onKeyDown);
  const drawer = new GameDrawer(app)
  const animLoop = new AnimationLoop(drawer)


  async function onKeyDown(key: KeyboardEvent) {
    animLoop.cancel()

    const dir = getKeyboardDirection(key);
    if (!dir) {
      return;
    }

    if (await step2048(sumScore, grid, dir, animLoop)) {
      const [field, ok] = addRandomField(grid);
      if (ok) {
        const { i, j, value } = field
        drawer.drawCell(i, j, value)
      }
    }
    isFinal = checkFinal(grid)
    if (isFinal) {
      document.removeEventListener("keydown", onKeyDown);
      drawer.drawFinal()
    }
  }

  drawer.drawBackground();
  const [field, ok] = addRandomField(grid);
  if (ok) {
    const { i, j, value } = field
    drawer.drawCell(i, j, value)
  }
}

export { pixi };