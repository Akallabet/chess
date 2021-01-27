import {
  addPieceToBoard,
  buildBoardFromFEN,
  getRandomCell,
  getFreeCells,
  getRandomRow,
  getAvailableRows,
  buildFENPiecePlacementFromBoard,
  isValidPiece,
} from './helpers'

import { COLORS, PIECES } from './constants'

export const engine = (
  args = {
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
  }
) => {
  const { FEN } = args
  let [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
    halfmoveClock,
    fullmoveNumber,
  ] = FEN.split(' ')

  let board = buildBoardFromFEN(piecePlacement)

  const updateBoard = (newBoard) => (board = newBoard)
  const updatePiecePlacement = (newPiecePlacement) => (piecePlacement = newPiecePlacement)

  const getInfo = () => {
    return {
      activeColor,
      board,
      FEN: `${piecePlacement} ${activeColor} ${castlingAvailability} ${enPassantTarget} ${halfmoveClock} ${fullmoveNumber}`,
    }
  }

  const createRandomPiece = (piece) => {
    if (isValidPiece(piece)) {
      const { rowIndex, cellIndex } = getRandomCell(
        getFreeCells(getRandomRow(getAvailableRows(board)))
      )
      updateBoard(addPieceToBoard({ piece, board, rowIndex, cellIndex }))
      updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
    }
    return getInfo()
  }

  return { getInfo, createRandomPiece }
}
