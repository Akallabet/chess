import { PIECES, FENPieces } from './constants'

export const buildBoardFromFEN = (FEN) => {
  const [piecePlacement] = FEN.split(' ')
  const addEmptyCells = (num) =>
    [...Array(Number(num))].map(() => ({
      piece: false,
    }))
  const buildCell = (row, cell) =>
    isNaN(cell) ? [...row, FENPieces[cell]] : [...row, ...addEmptyCells(cell)]
  const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

  return piecePlacement.split('/').map(buildRow)
}

export const buildFENPiecePlacementFromBoard = (board) => {
  const buildRowPlacement = (row) =>
    row.reduce((str, { piece, color }) => {
      if (piece) return `${str}${PIECES[piece].FEN[color]}`
      if (isNaN(str[str.length - 1])) return `${str}1`
      return `${str.slice(0, str.length - 1)}${Number(str[str.length - 1]) + 1}`
    }, '')
  return board.reduce((placement, row) => {
    const separator = placement ? '/' : ''
    return `${placement}${separator}${buildRowPlacement(row)}`
  }, '')
}

export const addPieceToBoard = ({ board, piece, color, y, x }) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { piece, color }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]

export const removePieceFromBoard = ({ board, y, x }) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { piece: false }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]

export const cleanBoard = (board) =>
  board.map((row) =>
    row.map(({ piece, color }) => {
      const props = {}
      if (color) props.color = color
      return { piece, ...props }
    })
  )

export const highlithPieceCell = (board, { y, x }) =>
  board.map((row, i) =>
    row.map((cell, j) => (i === y && j === x ? { ...cell, highlight: true } : { ...cell }))
  )
export const highlithMovesToBoard = (board) => (moves) => {
  moves.forEach(({ y, x }) => {
    board[y][x].highlight = true
  })
  return board
}

export const isValidPiece = (piece) => !!PIECES[piece]
