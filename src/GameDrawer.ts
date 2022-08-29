import * as PIXI from "pixi.js";
import { FONT_FAMILY, N } from "./Config";
import backgroundImage from "../assets/background.jpg";
import { getColorByValue } from "./Consts";

class GameDrawer {
  app: PIXI.Application;
  constructor(app: PIXI.Application) {
    this.app = app;

    const splash: PIXI.Container = new PIXI.Container();
    splash.name = "splash";
    app.stage.addChild(splash);
    splash.addChild(PIXI.Sprite.from(backgroundImage));

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
    splash.addChild(PIXI.Sprite.from(backgroundImage));
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

  drawGameOver() {
    const splash = this.splash();
    const graphics = this.graphics();

    const resizeTo = this.app.resizeTo as HTMLElement;
    const size = resizeTo.getBoundingClientRect().width;

    graphics.beginFill(0xc34288, 0.5);
    graphics.drawRoundedRect(0, 0, size, size, 0.25);
    graphics.endFill();

    const basicText = new PIXI.BitmapText("Game Over!", {
      fontName: FONT_FAMILY,
      fontSize: size / 10,
    });
    basicText.x = size / 2;
    basicText.y = size / 2;
    basicText.anchor = new PIXI.Point(0.5, 0.5);

    splash.addChild(basicText);
  }
}

export { GameDrawer };
