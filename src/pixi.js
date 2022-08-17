import { step2048 } from "./step2048"
import { addRandomField } from "./addRandomField"

function pixi() {
  let score = 0;
  let size = 600;
  let n = 4;
  let side = (size / 5)
  let space = (size / 5) * 0.2

  let app = new PIXI.Application({ width: size, height: size, antialias: true });
  document.body.appendChild(app.view);


  function drawBackground(container) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xC34288, 0.30);
        graphics.drawRoundedRect((i + 1) * space + i * side, (j + 1) * space + j * side, side, side, side * 0.15);
        graphics.endFill();
        container.addChild(graphics);
      }
    }
  }

  function sumScore(number){
    score+= number;
  }

  async function sleep(ms) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  document.addEventListener('keydown', onKeyDown);

  let lock = false

  async function onKeyDown(key) {
    const animate = async (animations) => {
  
      return new Promise((resolve) => {
        lock = true
        let d = 0

        const fn = function(ticker) {
          return function(dt) {
            const background = setupContainer()
            const mainContainer = background.getChildAt(0)
            drawBackground(mainContainer)
            dt /= 3
            //mainContainer.removeChildren()
            d += dt
            for (const anim of animations) {
              const { i, j, value } = anim(dt)
              if (d >= 1) {
                i = Math.round(i)
                j = Math.round(j)
              }
              drawCell(mainContainer, i, j, value)
              if (d >= 1) {
                ticker.destroy()
                resolve()
                lock = false
              }
            }
            app.stage.removeChildren();
            app.stage.addChild(background)
          }
        }

        const ticker = new PIXI.Ticker()
        ticker.add(fn(ticker))
        ticker.start()
      })
    }

    if (lock) {
      return
    }

    if (key.keyCode === 68 || key.keyCode === 39) {
      /*animateTransition(grid)
      
      */
      const needAddField = await step2048(sumScore, mat, 'right', animate)
      if (needAddField) {
        addRandomField(mat)
      }
      drawGrid(mat)
    }

    if (key.keyCode === 65 || key.keyCode === 37) {
      /*animateTransition(grid)
      
      */
      const needAddField = await step2048(sumScore, mat, 'left', animate)
      if (needAddField) {
        addRandomField(mat)
      }
      drawGrid(mat)
    }

    if (key.keyCode === 87 || key.keyCode === 38) {
      /*animateTransition(grid)
      
      */
      const needAddField = await step2048(sumScore, mat, 'up', animate)
      if (needAddField) {
        addRandomField(mat)
      }
      drawGrid(mat)
    }

    if (key.keyCode === 83 || key.keyCode === 40) {
      /*animateTransition(grid)
      
      */
      const needAddField = await step2048(sumScore, mat, 'down', animate)
      if (needAddField) {
        addRandomField(mat)
      }
      drawGrid(mat)
    }

  }

  function setupContainer() {
    const background = new PIXI.Container();

    let sprite = PIXI.Sprite.from('sample.jpg');
    background.addChild(sprite);

    const mainContainer = new PIXI.Container();
    background.addChild(mainContainer);
    return background
  }

  function drawCell(mainContainer, i, j, value) {
    let x = (j + 1) * space + j * side;
    let y = (i + 1) * space + i * side;

    const container = new PIXI.Container();
    const graphics = new PIXI.Graphics();
    const basicText = new PIXI.Text(value, new PIXI.TextStyle({ fontSize: size / 14 }));

    mainContainer.addChild(container);
    let color;
    switch(value){
      case(2):
        color = (0xc98fdb);
        break;
      case(4):
        color = (0xad69c2);
        break;
      case(8):
        color = (0x9e55b5);
        break;
      case(16):
        color = (0xa950b5);
        break;
      case(32):
        color = (0xb52cc7);
        break;
      case(64):
        color = (0x9c26ab);
        break;
      case(128):
        color = (0xc72cbf);
        break;
      case(256):
        color = (0xa813a1);
        break;
      case(512):
        color = (0x780173);
        break;
      case(1024):
        color = (0xcf1fa9);
        break;
      case(2048):
        color = (0xb0126b);
        break;
      default:
        color = (0xde1285)
    }

    basicText.x = x + side / 2;
    basicText.y = y + side / 2;
    basicText.anchor.set(0.5);
    graphics.beginFill(color);
    graphics.drawRoundedRect(x, y, side, side, side * 0.15);
    graphics.endFill();
    container.addChild(graphics);
    container.addChild(basicText);
  }

  function drawGrid(mat) {
    const background = setupContainer()
    const mainContainer = background.getChildAt(0)
    drawBackground(mainContainer)

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (mat[i][j] !== 0) {
          drawCell(mainContainer, i, j, mat[i][j])
        }
      }
    }

    app.stage.removeChildren();
    app.stage.addChild(background)
  }

  let mat = [
    [4, 4, 8, 16],
    [256, 128, 64, 32],
    [512, 1024, 2048, 4096],
    [8192, 16384, 32768, 65536],
  ]

  drawGrid(mat)

}

export {
  pixi
}