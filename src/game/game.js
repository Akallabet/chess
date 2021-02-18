import { rules as defaultRules } from './rules'
import {
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
  removeCastlingColor,
  checkCastlingAvailability,
  filterByName,
  filterByFile,
  filterByRank,
  extractOrigin,
  isDisambiguous,
  isCastling,
} from './helpers'
import { check, isDefined, pipe, pipeCond } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  activePiece: initialActivePiece,
  pieces = defaultNames,
  COLORS = defaultColors,
  files = defaultFiles,
  ranks = defaultRanks,
  NAMES = defaultNames,
  rules = defaultRules,
}) => {
  let FEN = buildFENObject(initialFEN)
  let board = initialBoard || buildBoardFromFEN({ pieces, COLORS, ...FEN })
  let legalMoves = generateMoves({ rules, COLORS, ranks, files, board, ...FEN })
  let activePiece = initialActivePiece
  const capturedPieces = initialCapturedPieces || []
  const actions = createActions({ pieces, ranks, files })

  const updateFEN = (parts) => (FEN = { ...FEN, ...parts })
  const updatePiecePlacement = (piecePlacement) => updateFEN({ piecePlacement })
  const changeTurn = () =>
    updateFEN({ activeColor: FEN.activeColor === COLORS.w ? COLORS.b : COLORS.w })
  const incrementFullmove = ({ fullmoveNumber }) =>
    updateFEN({ fullmoveNumber: fullmoveNumber + 1 })
  const updateCastling = (castling) => updateFEN({ castling })
  const removeCastling = () => updateCastling('-')
  const disallowCastling = (color) =>
    pipe(
      removeCastlingColor(color, COLORS, NAMES),
      check(isDefined, updateCastling, removeCastling)
    )
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = ({ ...FENInfo }) =>
    (legalMoves = generateMoves({ rules, COLORS, ranks, files, board, ...FENInfo }))
  const selectPiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const FromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isCastlingAvailable = (castling) =>
    checkCastlingAvailability({ NAMES, COLORS })(FEN, castling)
  const getMoves = ({ name, originY, originX, y, x }) =>
    pipe(
      filterByName(name),
      filterByFile(originX),
      filterByRank(originY)
    )(legalMoves[`${files[x]}${ranks[y]}`])

  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w
  const isMissingName = ({ name = NAMES.P, ...info }) => ({ name, ...info })

  const deselect = () => pipe(cleanBoard, updateBoard, deselectPiece)(board)

  const select = ({ y, x }) => {
    const piece = board[y][x]
    const { name, color } = piece
    const moves = rules[name]({ COLORS, board, color, y, x })

    pipe(cleanBoard, highligthMovesToBoard({ y, x, moves }), updateBoard)(board)
    selectPiece({ ...piece, y, x })
  }

  const executeCastling = ({ king, rook, destination }) =>
    pipe(
      cleanBoard,
      removePieceFromBoard(king),
      removePieceFromBoard(rook),
      addPieceToBoard({ name: NAMES.K, color: FEN.activeColor, ...king, ...destination.king }),
      addPieceToBoard({ name: NAMES.R, color: FEN.activeColor, ...rook, ...destination.rook }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      disallowCastling(FEN.activeColor),
      changeTurn,
      check(isWhiteTurn, incrementFullmove),
      updateLegalMoves
    )(board)

  const queensideCastling = ({ y, x }) =>
    executeCastling({
      king: { x, y },
      rook: { y, x: 0 },
      destination: {
        king: { x: 2 },
        rook: { x: 3 },
      },
    })

  const kingsideCastling = ({ y, x }) =>
    executeCastling({
      king: { x, y },
      rook: { y, x: files.length - 1 },
      destination: {
        king: { x: files.length - 2 },
        rook: { x: files.length - 3 },
      },
    })

  const castling = ({ isKingside, isQueenside }) =>
    pipe(
      check(
        () => isKingside,
        kingsideCastling,
        check(() => isQueenside, queensideCastling)
      )
    )({
      y: FEN.activeColor === COLORS.w ? 7 : 0,
      x: 4,
    })

  const move = ({ y, x, destination }) => {
    pipe(
      cleanBoard,
      removePieceFromBoard({ y, x }),
      addPieceToBoard({ ...board[y][x], ...destination }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      changeTurn,
      check(isWhiteTurn, incrementFullmove),
      updateLegalMoves
    )(board)
  }

  const getSAN = (piece, { rank, file }) => {
    const buildOrigin = (origin) => `${origin}${file}${rank}`
    const buildOriginName = ([{ name }]) => buildOrigin(`${name}`)
    const buildOriginNameAndFile = ([{ name, x }]) => buildOrigin(`${name}${files[x]}`)
    const buildOriginNameFileAndRank = ([{ name, y, x }]) =>
      buildOrigin(`${name}${files[x]}${ranks[y]}`)
    return pipeCond(
      [isDisambiguous, buildOriginName, filterByName(piece.name)],
      [isDisambiguous, buildOriginName, filterByFile(piece.x)],
      [isDisambiguous, buildOriginNameAndFile, filterByRank(piece.y)],
      [isDisambiguous, buildOriginNameFileAndRank]
    )(legalMoves[`${file}${rank}`])
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
      check(
        isCastling,
        check(isCastlingAvailable, castling),
        pipe(getMoves, check(isDisambiguous, pipe(extractOrigin, move)))
      ),
      deselect,
      getInfo
    ),
    getSAN,
  }
  return ret
}
