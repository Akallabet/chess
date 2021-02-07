export const buildBoardFromFEN = ({ PIECES }) => {
  const extractBoardInfo = (square) => {
    const { name, color } = PIECES[square]
    return { name, color }
  }

  return (FEN) => {
    const [piecePlacement] = FEN.split(' ')
    const addEmptyCells = (num) => [...Array(Number(num))].map(() => ({}))
    const buildCell = (row, square) =>
      isNaN(square) ? [...row, extractBoardInfo(square)] : [...row, ...addEmptyCells(square)]
    const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

    return piecePlacement.split('/').map(buildRow)
  }
}
