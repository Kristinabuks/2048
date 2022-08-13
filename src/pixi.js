import { step2048 } from "./step2048"
import { addRandomField } from "./addRandomField"

function pixi() {
  let size = 600;
  let n = 4;
  let side = (size / 5)
  let space = (size / 5) * 0.2

  let app = new PIXI.Application({ width: size, height: size, antialias: true });
  document.body.appendChild(app.view);

  let sprite = PIXI.Sprite.from('sample.jpg');

  const background = new PIXI.Container();
  app.stage.addChild(background);

  background.addChild(sprite);

  const mainContainer = new PIXI.Container();
  background.addChild(mainContainer);




  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const container = new PIXI.Container();
      background.addChild(container);
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xC34288, 0.30);
      graphics.drawRoundedRect((i + 1) * space + i * side, (j + 1) * space + j * side, side, side, side * 0.15);
      graphics.endFill();
      container.addChild(graphics);
    }
  }

  document.addEventListener('keydown', onKeyDown);

  function onKeyDown(key) {
    switch (key.keyCode) {

    }

    if (key.keyCode === 68 || key.keyCode === 39) {
      /*animateTransition(grid)
      
      app.stage.removeChildren()
      */
      mainContainer.removeChildren()
      step2048(mat, 'right')
      addRandomField(mat)
      drawGrid(mat)
    }

    if (key.keyCode === 65 || key.keyCode === 37) {
      /*animateTransition(grid)
      
      app.stage.removeChildren()
      */
      mainContainer.removeChildren()
      step2048(mat, 'left')
      addRandomField(mat)
      drawGrid(mat)
    }

    if (key.keyCode === 87 || key.keyCode === 38) {
      /*animateTransition(grid)
      
      app.stage.removeChildren()
      */
      mainContainer.removeChildren()
      step2048(mat, 'up')
      addRandomField(mat)
      drawGrid(mat)
    }

    if (key.keyCode === 83 || key.keyCode === 40) {
      /*animateTransition(grid)
      
      app.stage.removeChildren()
      */
      mainContainer.removeChildren()
      step2048(mat, 'down')
      addRandomField(mat)
      drawGrid(mat)
    }

  }

  function drawGrid(mat) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (mat[j][i] !== 0) {
          let x = (i + 1) * space + i * side;
          let y = (j + 1) * space + j * side;

          const container = new PIXI.Container();
          const graphics = new PIXI.Graphics();
          const basicText = new PIXI.Text(mat[j][i], new PIXI.TextStyle({ fontSize: size / 14 }));

          mainContainer.addChild(container);

          basicText.x = x + side / 2;
          basicText.y = y + side / 2;
          basicText.anchor.set(0.5);

          graphics.beginFill(0xa77db8);
          graphics.drawRoundedRect(x, y, side, side, side * 0.15);
          graphics.endFill();
          container.addChild(graphics);
          container.addChild(basicText);
        }
      }
    }
  }

  let mat = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]

  drawGrid(mat)

  app.ticker.add(() => {

  });

}

export {
  pixi
}