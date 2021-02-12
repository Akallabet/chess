import { PIECES as defaultPieces } from './constants'
import { helpers } from './helpers'
import { compose, createContext } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  PIECES = defaultPieces,
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8']

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
  let turn = FEN.split(' ')[1]
  let activePiece

  const capturedPieces = initialCapturedPieces || []

  const updateFEN = (newFEN) => (FEN = newFEN)
  const updateBoard = (newBoard) => (board = newBoard)
  const updatePiecePlacement = (piecePlacement) => {
    updateFEN(`${piecePlacement} ${FEN.split(' ').slice(1).join(' ')}`)
  }
  const changeTurn = () => (turn === 'w' ? (turn = 'b') : (turn = 'w'))
  const updateActivePiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const getInfo = () => ({
    FEN,
    board,
    capturedPieces,
    activePiece,
  })

  const isValid = (fn) => ({ y, x }) => {
    const { color } = board[y][x]
    if (color === turn) fn({ x, y })
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
    const legalMove = board
      .reduce(getMovingPieces(turn, name), [])
      .reduce(getLegalMoves(board), [])
      .find((move) => move.x === x && move.y === y)

    if (legalMove) {
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
    select: compose(FromSAN, isValid(select), getInfo),
    deselect: compose(deselect, getInfo),
    move: compose(FromSAN, move, hasItMoved, getInfo),
  }
}
