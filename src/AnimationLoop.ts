import * as PIXI from "pixi.js";
import { IAnimator } from "./Animator";
import { GameDrawer } from "./GameDrawer";

class AnimationLoop {
  cancelAnim: Array<IAnimator>;
  drawer: GameDrawer;

  constructor(drawer: GameDrawer) {
    this.cancelAnim = [];
    this.drawer = drawer;
  }

  async run(animations: Array<IAnimator>) {
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

export { AnimationLoop };
