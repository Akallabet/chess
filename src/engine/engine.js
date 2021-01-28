import { PIECES } from './constants'
import {
  addPieceToBoard,
  buildBoardFromFEN,
  getRandomCell,
  getFreeCells,
  getRandomRow,
  getAvailableRows,
  buildFENPiecePlacementFromBoard,
  isValidPiece,
  highlithMovesToBoard,
  cleanBoard,
} from './helpers'

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

  const getInfo = () => ({
    activeColor,
    board,
    FEN: `${piecePlacement} ${activeColor} ${castlingAvailability} ${enPassantTarget} ${halfmoveClock} ${fullmoveNumber}`,
  })

  const createRandomPiece = ({ piece, color }) => {
    if (isValidPiece(piece)) {
      const { rowIndex, cellIndex } = getRandomCell(
        getFreeCells(getRandomRow(getAvailableRows(board, piece)))
      )
      const newBoard = addPieceToBoard({ piece, color, board, rowIndex, cellIndex })
      updateBoard(newBoard)
      updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
    }
    return getInfo()
  }

  const getLegalMoves = ({ y, x }) => {
    const { piece, color } = board[y][x]
    const { moves } = PIECES[piece]
    updateBoard(highlithMovesToBoard(cleanBoard(board))(moves({ board, color, y, x })))
    return getInfo()
  }

  return {
    getInfo,
    createRandomPiece,
    getLegalMoves,
  }
}
