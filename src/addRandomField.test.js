import { addRandomField } from "./addRandomField"

test('number of field in array', () => {
  let mat = [
    [2, 2, 2, 2],
    [0, 2, 2, 2],
    [2, 4, 2, 2],
    [8, 8, 2, 2],
  ]
  addRandomField(mat)
  expect(mat).toStrictEqual([
    [2, 2, 2, 2],
    [2, 2, 2, 2],
    [2, 4, 2, 2],
    [8, 8, 2, 2],
  ]);
});


