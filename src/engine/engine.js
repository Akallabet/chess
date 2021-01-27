import {
  addPieceToBoard,
  buildBoardFromFEN,
  getRandomCell,
  getFreeCells,
  getRandomRow,
  getAvailableRows,
  buildFENPiecePlacementFromBoard,
} from './helpers'

import { COLORS, PIECES } from './constants'

export const engine = (
  args = {
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
  }
) => {
  let { FEN } = args
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

  const createRandomPawn = (color = COLORS[0]) => {
    const piece = PIECES[color][0]
    const { rowIndex, cellIndex } = getRandomCell(
      getFreeCells(getRandomRow(getAvailableRows(board)))
    )
    updateBoard(addPieceToBoard({ piece, board, rowIndex, cellIndex }))
    updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
    return getInfo()
  }

  return { getInfo, createRandomPawn }
}
