import { COLORS } from './colors'

export const empty = () => []

export const whitePawn = ({ board, y, x }) => {
  const moves = []
  if (board[y - 1][x] && !board[y - 1][x].name) {
    moves.push({ y: y - 1, x })
  }
  if (y === 6 && board[y - 2][x] && !board[y - 2][x].name) {
    moves.push({ y: y - 2, x })
  }
  if (board[y - 1][x + 1] && board[y - 1][x + 1].name && board[y - 1][x + 1].color === COLORS.b) {
    moves.push({ y: y - 1, x: x + 1 })
  }
  if (board[y - 1][x - 1] && board[y - 1][x - 1].name && board[y - 1][x - 1].color === COLORS.b) {
    moves.push({ y: y - 1, x: x - 1 })
  }
  return moves
}

export const blackPawn = ({ board, y, x }) => {
  const moves = []
  if (board[y + 1][x] && !board[y + 1][x].name) {
    moves.push({ y: y + 1, x })
  }
  if (y === 1 && board[y + 2][x] && !board[y + 2][x].name) {
    moves.push({ y: y + 2, x })
  }
  if (board[y + 1][x + 1] && board[y + 1][x + 1].name && board[y + 1][x + 1].color === COLORS.w) {
    moves.push({ y: y + 1, x: x + 1 })
  }
  if (board[y + 1][x - 1] && board[y + 1][x - 1].name && board[y + 1][x - 1].color === COLORS.w) {
    moves.push({ y: y + 1, x: x - 1 })
  }
  return moves
}

const straight = ({ board, color, y, x }) => {
  const moves = []
  for (let square = x; square < board.length - 1; square++) {
    if (board[y][square].color && board[y][square].color !== color) moves.push({ y, x: square })
    if (board[y][square].color) break
  }
  for (let square = x; square >= 0; square--) {
    if (board[y][square].color && board[y][square].color !== color) moves.push({ y, x: square })
    if (board[y][square].color) break
  }
  for (let line = y; line < board.length - 1; line++) {
    if (board[line][x].color && board[line][x].color !== color) moves.push({ y: line, x })
    if (board[line][x].color) break
  }
  for (let line = y; line >= 0; line--) {
    if (board[line][x].color && board[line][x].color !== color) moves.push({ y: line, x })
    if (board[line][x].color) break
  }
  return moves
}

const oblique = ({ board, color, y, x }) => {
  const moves = []
}
