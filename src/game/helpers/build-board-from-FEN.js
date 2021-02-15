export const buildBoardFromFEN = ({ PIECES, piecePlacement }) => {
  const extractBoardInfo = (square) => {
    const { name, color } = PIECES.get(square)
    return { name, color }
  }
  const addEmptyCells = (num) => [...Array(Number(num))].map(() => ({}))
  const buildCell = (row, square) =>
    isNaN(square) ? [...row, extractBoardInfo(square)] : [...row, ...addEmptyCells(square)]
  const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

  return piecePlacement.split('/').map(buildRow)
}
