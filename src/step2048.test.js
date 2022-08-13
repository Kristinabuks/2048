import { step2048 } from "./step2048"


test('right-to-left swipe case ', () => {
  let mat = [
    [0, 0, 0, 8],
    [4, 4, 4, 4],
    [4, 4, 4, 8],
    [0, 8, 0, 8],
  ]

  step2048(mat, 'left')
  expect(mat).toStrictEqual([
    [8, 0, 0, 0],
    [8, 8, 0, 0],
    [8, 4, 8, 0],
    [16, 0, 0, 0],
  ]);
});

test('left-to-right swipe case', () => {
  let mat = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 8, 2, 2],
  ]

  step2048(mat, 'right')
  expect(mat).toStrictEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 16, 4],
  ]);
});


test('up-to-down swipe case', () => {
  let mat = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 0, 2, 0],
    [8, 8, 2, 2],
  ]

  step2048(mat, 'down')
  expect(mat).toStrictEqual([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [16, 8, 4, 2],
  ]);
});

test('down-to-up swipe case', () => {
  let mat = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [8, 0, 2, 0],
    [8, 8, 2, 2],
  ]

  step2048(mat, 'up')
  expect(mat).toStrictEqual([
    [16, 8, 4, 2],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});