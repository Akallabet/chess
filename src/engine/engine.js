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

export const engine = ({ FEN: initialFEN }) => {
  let FEN = initialFEN
  let board = buildBoardFromFEN(initialFEN)
  let activePiece = false
  const capturedPieces = []

  const updateFEN = (newFEN) => (FEN = newFEN)
  const updateBoard = (newBoard) => (board = newBoard)
  const updatePiecePlacement = (piecePlacement) => {
    const [_, ...FENParts] = FEN.split(' ')
    updateFEN(`${piecePlacement} ${FENParts.join(' ')}`)
  }
  const updateActivePiece = (newActivePiece) => (activePiece = newActivePiece)

  const getInfo = () => ({
    FEN,
    board,
    activePiece,
    capturedPieces,
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
  }

  const deselectPiece = ({ y, x }) => {
    updateBoard(cleanBoard(board))
    updateActivePiece(false)
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
  }

  const moveActivePiece = ({ y, x }) => {
    const cell = { ...board[y][x] }
    updateBoard(
      addPieceToBoard({
        board: removePieceFromBoard({ board: cleanBoard(board), ...activePiece }),
        ...activePiece,
        x,
        y,
      })
    )
    if (cell.piece) capturedPieces.push(cell)
    updateActivePiece(false)
    updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
  }

  const reset = ({ FEN: newFEN }) => {
    updateFEN(newFEN)
    updateBoard(buildBoardFromFEN(newFEN))
    updateActivePiece(false)
  }

  const addInfo = (f) => (args) => {
    f(args)
    return getInfo()
  }

  return {
    getInfo,
    ...getInfo(),
    createRandomPiece: addInfo(createRandomPiece),
    selectPiece: addInfo(selectPiece),
    deselectPiece: addInfo(deselectPiece),
    moveActivePiece: addInfo(moveActivePiece),
    reset: addInfo(reset),
  }
}
