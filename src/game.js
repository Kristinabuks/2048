import { step2048 } from "./step2048";
import { addRandomField } from "./addRandomField";
import * as PIXI from "pixi.js";
import { KeyboardEnum } from "./enumKeyboard";

function getKeyboardDirection(key) {
  switch (key.keyCode) {
    case KeyboardEnum.RIGHT_ARROW:
    case KeyboardEnum.KEY_D:
      return "right";
    case KeyboardEnum.LEFT_ARROW:
    case KeyboardEnum.KEY_A:
      return "left";
    case KeyboardEnum.UP_ARROW:
    case KeyboardEnum.KEY_W:
      return "up";
    case KeyboardEnum.DOWN_ARROW:
    case KeyboardEnum.KEY_S:
      return "down";
    default:
      return null;
  }
}

function getColorByValue(value) {
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
  constructor(app) {
    this.app = app

    const splash = new PIXI.Container()
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

  graphics() {
    return this.app.stage.getChildByName("graphics")
  }

  labels() {
    return this.app.stage.getChildByName("labels")
  }

  splash() {
    return this.app.stage.getChildByName("labels")
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

  drawCell(i, j, value) {
    const graphics = this.graphics()
  
    const size = 600;
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
    const basicText = new PIXI.Text(
      value,
      new PIXI.TextStyle({ fontSize: value > 8192 ? size / 16 : size / 14 })
    );
    basicText.x = x + side / 2;
    basicText.y = y + side / 2;
    basicText.anchor.set(0.5);
    labels.addChild(basicText);
  }
}

class AnimationLoop {
  constructor(drawer) {
    this.animations = []
    this.drawer = drawer
  }

  async run(animations) {
    this.animations = animations
  
    const ticker = new PIXI.Ticker();

    await new Promise((resolve) => {
      ticker.add((dt) => {
        this.drawer.drawBackground()
        let finish = true 
        for (const anim of animations) {
          const { x: i, y: j, scale, value } = anim.currentState();
          this.drawer.drawCell(i, j, value)
          if (anim.next(dt)) {
            finish = false
          }
        }
        if (finish) {
          resolve();
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

function buildGrid() {
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

function pixi() {
  let score = 0;
  let size = 600;

  let app = new PIXI.Application({
    width: size,
    height: size,
    antialias: true,
  });
  document.body.appendChild(app.view);

  const grid = buildGrid();

  const scoreContainer = document.createElement("div");
  const el = document.getElementById("root");
  el.appendChild(scoreContainer);

  function sumScore(number) {
    score += number;
    scoreContainer.innerText = score;
  }

  document.addEventListener("keydown", onKeyDown);
  const drawer = new GameDrawer(app, grid)
  const animLoop = new AnimationLoop(drawer)

  async function onKeyDown(key) {
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
  }

  drawer.drawBackground();
  const [field, ok] = addRandomField(grid);
  if (ok) {
    const { i, j, value } = field
    drawer.drawCell(i, j, value)
  }
}

export { pixi };
