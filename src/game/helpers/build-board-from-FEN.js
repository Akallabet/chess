export const buildBoardFromFEN = ({ pieces, COLORS, piecePlacement }) => {
  const extractBoardInfo = (square) => {
    const color = pieces[square] ? COLORS.w : COLORS.b
    const name = pieces[square.toUpperCase()]
    return { name, color }
  }
  const addEmptyCells = (num) => [...Array(Number(num))].map(() => ({}))
  const buildCell = (row, square) =>
    isNaN(square) ? [...row, extractBoardInfo(square)] : [...row, ...addEmptyCells(square)]
  const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

  return piecePlacement.split('/').map(buildRow)
}
