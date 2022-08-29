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

export { getKeyboardDirection, getColorByValue };
