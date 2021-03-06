import { pipe } from '../utils'

export const cleanBoard = (board) =>
  board.map((row) =>
    row.map(({ _meta, ...square }) => ({
      ...square,
      meta: {},
    }))
  )

export const findPosition = (board, name, color) => {
  let piece
  for (let y = 0; y < board.length; y++) {
    const row = board[y]
    for (let x = 0; x < row.length; x++) {
      const square = row[x]
      if (square.name === name && square.color === color) return { y, x }
    }
  }
  return piece
}

export const addPieceToBoard = ({ name, color, y, x }) => (board) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { name, color, meta: {} }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]

export const removePieceFromBoard = ({ y, x }) => (board) => [
  ...board.slice(0, y),
  [...board[y].slice(0, x), { meta: {} }, ...board[y].slice(x + 1)],
  ...board.slice(y + 1),
]

export const movePiece = (piece, origin, destination) =>
  pipe(cleanBoard, removePieceFromBoard(origin), addPieceToBoard({ ...piece, ...destination }))
