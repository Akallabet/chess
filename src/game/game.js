import {
  PIECES as defaultPieces,
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
} from './constants'
import { helpers } from './helpers'
import { compose, createContext } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  PIECES = defaultPieces,
  COLORS = defaultColors,
  files = defaultFiles,
  ranks = defaultRanks,
}) => {
  const {
    addPieceToBoard,
    buildBoardFromFEN,
    buildFENPiecePlacementFromBoard,
    highligthMovesToBoard,
    cleanBoard,
    removePieceFromBoard,
    getMovingPieces,
    getLegalMoves,
    actions,
  } = createContext({ PIECES, files, ranks })(helpers)

  let FEN = initialFEN
  let board = initialBoard || buildBoardFromFEN(initialFEN)
  let activePiece
  const capturedPieces = initialCapturedPieces || []

  const turn = () => FEN.split(' ')[1]
  const updateFEN = (newPart, index) =>
    (FEN = FEN.split(' ')
      .map((part, i) => (i === index ? newPart : part))
      .join(' '))
  const updatePiecePlacement = (piecePlacement) => updateFEN(piecePlacement, 0)
  const changeTurn = () => updateFEN(turn() === COLORS.w ? COLORS.b : COLORS.w, 1)

  const updateBoard = (newBoard) => (board = newBoard)
  const updateActivePiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const getInfo = () => ({
    files,
    ranks,
    FEN,
    board,
    capturedPieces,
    activePiece,
  })

  const isValidTurn = (fn) => ({ y, x }) => {
    const { color } = board[y][x]
    if (color === turn()) fn({ x, y })
  }

  const FromSAN = (notation) => {
    const [, ret] = actions.find(([regexp]) => new RegExp(regexp, 'g').test(notation))
    return ret(notation)
  }

  const deselect = () => {
    updateBoard(cleanBoard(board))
    deselectPiece()
  }

  const select = ({ y, x }) => {
    const piece = board[y][x]
    const { name, color } = piece
    const moves = PIECES.get(name, color).moves({ board, color, y, x })

    compose(cleanBoard, highligthMovesToBoard({ y, x, moves }), updateBoard)(board)
    updateActivePiece(piece)
  }

  const move = ({ name, y, x }) => {
    const legalMoves = board
      .reduce(getMovingPieces(turn(), name), [])
      .reduce(getLegalMoves(board), [])
      .filter((move) => move.x === x && move.y === y)

    if (legalMoves.length === 1) {
      const legalMove = legalMoves[0]
      const square = { ...board[legalMove.origin.y][legalMove.origin.x] }
      compose(
        cleanBoard,
        removePieceFromBoard({ ...legalMove.origin }),
        addPieceToBoard({ ...square, x, y }),
        updateBoard
      )(board)
      compose(buildFENPiecePlacementFromBoard, updatePiecePlacement)(board)
      return true
    }
    deselectPiece()
    return false
  }
  const hasItMoved = (hasMoved) => (hasMoved ? changeTurn() : () => {})

  return {
    getInfo,
    select: compose(FromSAN, isValidTurn(select), getInfo),
    deselect: compose(deselect, getInfo),
    move: compose(FromSAN, move, hasItMoved, getInfo),
  }
}
