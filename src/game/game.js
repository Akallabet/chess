import {
  PIECES as defaultPieces,
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
  NAMES as defaultNames,
  NAMES,
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
import { check, isDefined, log, noop, pipe, when } from './utils'

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
  const updateCastling = (castling) => updateFEN({ castling })
  const removeCastling = () => updateCastling('-')
  const disallowCastling = (color) =>
    pipe(
      ({ castling }) =>
        castling
          .split('')
          .filter(
            (name) =>
              (color === COLORS.w && name !== NAMES[name]) ||
              (color === COLORS.b && name !== NAMES[name.toUpperCase()].toLowerCase())
          )
          .join(''),
      check(isDefined, updateCastling, removeCastling)
    )
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = ({ ...FENInfo }) =>
    (legalMoves = generateMoves({ PIECES, ranks, files, board, ...FENInfo }))
  const selectPiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const FromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isCastling = ({ isCastling }) => isCastling
  const isDisambiguous = (info) => legalMoves.getMoves(info).length === 1
  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w
  const isMissingName = ({ name = names.P, ...info }) => ({ name, ...info })

  const deselect = () => pipe(cleanBoard, updateBoard, deselectPiece)(board)

  const select = ({ y, x }) => {
    const piece = board[y][x]
    const { name, color } = piece
    const moves = PIECES.get(name, color).moves({ board, color, y, x })

    pipe(cleanBoard, highligthMovesToBoard({ y, x, moves }), updateBoard)(board)
    selectPiece({ ...piece, y, x })
  }

  const updateBoardAfterMove = pipe(updateBoard, buildFENPiecePlacementFromBoard({ PIECES }))
  const updateFENAfterMove = pipe(changeTurn, check(isWhiteTurn, incrementFullmove))
  const cleanupAfterMove = pipe(updateLegalMoves, deselect)

  const queensideCastling = ({ y, x }) =>
    pipe(
      cleanBoard,
      removePieceFromBoard({ y, x }),
      removePieceFromBoard({ y, x: 0 }),
      addPieceToBoard({ name: NAMES.K, color: FEN.activeColor, y, x: 2 }),
      addPieceToBoard({ name: NAMES.R, color: FEN.activeColor, y, x: 3 }),
      updateBoardAfterMove,
      updatePiecePlacement,
      disallowCastling(FEN.activeColor),
      updateFENAfterMove,
      cleanupAfterMove
    )(board)

  const kingsideCastling = ({ y, x }) =>
    pipe(
      cleanBoard,
      removePieceFromBoard({ y, x }),
      removePieceFromBoard({ y, x: files.length - 1 }),
      addPieceToBoard({ name: NAMES.K, color: FEN.activeColor, y, x: files.length - 2 }),
      addPieceToBoard({ name: NAMES.R, color: FEN.activeColor, y, x: files.length - 3 }),
      updateBoardAfterMove,
      updatePiecePlacement,
      disallowCastling(FEN.activeColor),
      updateFENAfterMove,
      cleanupAfterMove
    )(board)

  const castling = ({ isKingside, isQueenside }) => {
    const king = {
      y: FEN.activeColor === COLORS.w ? 7 : 0,
      x: 4,
    }
    return pipe(isKingside ? kingsideCastling : isQueenside ? queensideCastling : noop)(king)
  }

  const move = ({ name, originY, originX, y, x }) => {
    const legalMove = legalMoves.getMoves({ name, originY, originX, y, x })[0]
    pipe(
      cleanBoard,
      removePieceFromBoard({ ...legalMove }),
      addPieceToBoard({ ...board[legalMove.y][legalMove.x], x, y }),
      updateBoardAfterMove,
      updatePiecePlacement,
      updateFENAfterMove,
      cleanupAfterMove
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
    move: pipe(
      FromSAN,
      isMissingName,
      check(isCastling, castling, check(isDisambiguous, move)),
      getInfo
    ),
  }
  return ret
}
