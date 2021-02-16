import {
  PIECES as defaultPieces,
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
  NAMES as defaultNames,
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
import { check, log, pipe, when } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  activePiece: initialActivePiece,
  PIECES = defaultPieces,
  COLORS = defaultColors,
  files = defaultFiles,
  ranks = defaultRanks,
  names = defaultNames,
}) => {
  let FEN = buildFENObject(initialFEN)
  let board = initialBoard || buildBoardFromFEN({ PIECES, ...FEN })
  let legalMoves = generateMoves({ PIECES, ranks, files, board, ...FEN })
  let activePiece = initialActivePiece
  const capturedPieces = initialCapturedPieces || []
  const actions = createActions({ PIECES, ranks, files })

  const updateFEN = (parts) => (FEN = { ...FEN, ...parts })
  const updatePiecePlacement = (piecePlacement) => updateFEN({ piecePlacement })
  const changeTurn = ({ activeColor }) =>
    updateFEN({ activeColor: activeColor === COLORS.w ? COLORS.b : COLORS.w })
  const incrementFullmove = ({ fullmoveNumber }) =>
    updateFEN({ fullmoveNumber: fullmoveNumber + 1 })
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = ({ ...FENInfo }) =>
    (legalMoves = generateMoves({ PIECES, ranks, files, board, ...FENInfo }))
  const selectPiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isDisambiguous = (info) => legalMoves.getMoves(info).length === 1

  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w

  const FromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const isMissingName = ({ name = names.P, ...info }) => ({
    name,
    ...info,
  })

  const deselect = () => pipe(cleanBoard, updateBoard, deselectPiece)(board)

  const select = ({ y, x }) => {
    const piece = board[y][x]
    const { name, color } = piece
    const moves = PIECES.get(name, color).moves({ board, color, y, x })

    pipe(cleanBoard, highligthMovesToBoard({ y, x, moves }), updateBoard)(board)
    selectPiece({ ...piece, y, x })
  }

  const move = ({ name, originY, originX, y, x }) => {
    const legalMove = legalMoves.getMoves({ name, originY, originX, y, x })[0]
    pipe(
      cleanBoard,
      removePieceFromBoard({ ...legalMove }),
      addPieceToBoard({ ...board[legalMove.y][legalMove.x], x, y }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ PIECES }),
      updatePiecePlacement,
      changeTurn,
      check(isWhiteTurn, incrementFullmove),
      updateLegalMoves,
      deselect
    )(board)
  }

  const getInfo = () => ({
    files,
    ranks,
    FEN: buildFENString(FEN),
    board,
    legalMoves,
    capturedPieces,
    activePiece,
    ...FEN,
    ...ret,
  })

  const ret = {
    getInfo,
    select: pipe(FromSAN, check(isValidColor, select), getInfo),
    deselect: pipe(deselect, getInfo),
    move: pipe(FromSAN, isMissingName, check(isDisambiguous, move), getInfo),
  }
  return ret
}
