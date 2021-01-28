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
  highlithPieceCell,
  removePieceFromBoard,
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
  let activePiece = false

  const updateBoard = (newBoard) => (board = newBoard)
  const updatePiecePlacement = (newPiecePlacement) => (piecePlacement = newPiecePlacement)
  const updateActivePiece = (newActivePiece) => (activePiece = newActivePiece)

  const getInfo = () => ({
    activeColor,
    board,
    FEN: `${piecePlacement} ${activeColor} ${castlingAvailability} ${enPassantTarget} ${halfmoveClock} ${fullmoveNumber}`,
    activePiece,
  })

  const createRandomPiece = ({ piece, color }) => {
    if (isValidPiece(piece)) {
      const { rowIndex: y, cellIndex: x } = getRandomCell(
        getFreeCells(getRandomRow(getAvailableRows(board, piece)))
      )
      const newBoard = addPieceToBoard({ piece, color, board, y, x })
      updateBoard(newBoard)
      updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
    }
    return getInfo()
  }

  const deselectPiece = ({ y, x }) => {
    updateBoard(cleanBoard(board))
    updateActivePiece(false)
    return getInfo()
  }

  const selectPiece = ({ y, x }) => {
    const { piece, color } = board[y][x]
    const { moves } = PIECES[piece]
    updateBoard(
      highlithMovesToBoard(highlithPieceCell(cleanBoard(board), { y, x }))(
        moves({ board, color, y, x })
      )
    )
    updateActivePiece({ y, x, piece, color })
    return getInfo()
  }

  const moveActivePiece = ({ y, x }) => {
    updateBoard(
      addPieceToBoard({
        board: removePieceFromBoard({ board: cleanBoard(board), ...activePiece }),
        ...activePiece,
        x,
        y,
      })
    )
    updateActivePiece(false)
    return getInfo()
  }

  return {
    getInfo,
    createRandomPiece,
    selectPiece,
    deselectPiece,
    moveActivePiece,
  }
}
