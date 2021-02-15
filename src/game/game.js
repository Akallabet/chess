import {
  PIECES as defaultPieces,
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
} from './constants'
import {
  buildBoardFromFEN,
  buildFENPiecePlacementFromBoard,
  addPieceToBoard,
  highligthMovesToBoard,
  cleanBoard,
  removePieceFromBoard,
  createActions,
  generateMoves,
  buildFENString,
  buildFENObject,
} from './helpers'
import { check, pipe } from './utils'

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
  let FEN = buildFENObject(initialFEN)
  let board = initialBoard || buildBoardFromFEN({ PIECES, ...FEN })
  let legalMoves = generateMoves({ PIECES, ranks, files, board, ...FEN })
  let activePiece = initialActivePiece
  const capturedPieces = initialCapturedPieces || []
  const actions = createActions({ PIECES, ranks, files })

  const updateFEN = (parts) => (FEN = { ...FEN, ...parts })
  const updatePiecePlacement = (piecePlacement) => updateFEN({ piecePlacement })
  const changeTurn = () =>
    updateFEN({ activeColor: FEN.activeColor === COLORS.w ? COLORS.b : COLORS.w })
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = () =>
    (legalMoves = generateMoves({ PIECES, ranks, files, board, ...FEN }))
  const updateActivePiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const getInfo = () => ({
    files,
    ranks,
    FEN: buildFENString(FEN),
    board,
    legalMoves,
    capturedPieces,
    activePiece,
  })

  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor

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
      buildFENPiecePlacementFromBoard({ PIECES }),
      updatePiecePlacement
    )(board)
  }

  return {
    getInfo,
    select: pipe(FromSAN, check(isValidColor, select), getInfo),
    deselect: pipe(deselect, getInfo),
    move: pipe(
      FromSAN,
      check(isDisambiguous, pipe(move, deselect, changeTurn, updateLegalMoves)),
      getInfo
    ),
  }
}
