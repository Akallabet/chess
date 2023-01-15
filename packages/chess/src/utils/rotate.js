export const rotate = matrix => {
  const rotated = [];
  for (let y = matrix.length - 1; y >= 0; y--) {
    const row = [];
    for (let x = matrix[y].length - 1; x >= 0; x--) {
      row.push(matrix[y][x]);
    }
    rotated.push(row);
  }
  return rotated;
};
