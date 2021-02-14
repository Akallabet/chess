import {
  PIECES as defaultPieces,
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
} from './constants'
import { helpers } from './helpers'
import { check, pipe, createContext } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  activePiece: initialActivePiece,
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
    getLegalMoves,
    actions,
  } = createContext({ PIECES, files, ranks })(helpers)

  let FEN = initialFEN
  let board = initialBoard || buildBoardFromFEN(initialFEN)
  const turn = () => FEN.split(' ')[1]
  let legalMoves = getLegalMoves(board, turn())
  let activePiece = initialActivePiece
  const capturedPieces = initialCapturedPieces || []

  const updateFEN = (newPart, index) =>
    (FEN = FEN.split(' ')
      .map((part, i) => (i === index ? newPart : part))
      .join(' '))
  const updatePiecePlacement = (piecePlacement) => updateFEN(piecePlacement, 0)
  const changeTurn = () => updateFEN(turn() === COLORS.w ? COLORS.b : COLORS.w, 1)

  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = () => (legalMoves = getLegalMoves(board, turn()))
  const updateActivePiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const getInfo = () => ({
    files,
    ranks,
    FEN,
    board,
    legalMoves,
    capturedPieces,
    activePiece,
  })

  const isValidTurn = ({ y, x }) => board[y][x].color === turn()

  const FromSAN = (notation) => {
    const [, ret] = actions.find(([regexp]) => new RegExp(regexp, 'g').test(notation))
    return ret(notation)
  }

  const deselect = () => pipe(cleanBoard, updateBoard, deselectPiece)(board)

  const select = ({ y, x }) => {
    const piece = board[y][x]
    const { name, color } = piece
    const moves = PIECES.get(name, color).moves({ board, color, y, x })

    pipe(cleanBoard, highligthMovesToBoard({ y, x, moves }), updateBoard)(board)
    updateActivePiece({ ...piece, y, x })
  }

  const isDisambiguous = (info) => legalMoves.getMoves(info).length === 1

  const move = ({ name, originY, originX, y, x }) => {
    const legalMove = legalMoves.getMoves({ name, originY, originX, y, x })[0]
    pipe(
      cleanBoard,
      removePieceFromBoard({ ...legalMove }),
      addPieceToBoard({ ...board[legalMove.y][legalMove.x], x, y }),
      updateBoard,
      buildFENPiecePlacementFromBoard,
      updatePiecePlacement
    )(board)
  }

  return {
    getInfo,
    select: pipe(FromSAN, check(isValidTurn, select), getInfo),
    deselect: pipe(deselect, getInfo),
    move: pipe(
      FromSAN,
      check(isDisambiguous, pipe(move, deselect, changeTurn, updateLegalMoves)),
      getInfo
    ),
  }
}
