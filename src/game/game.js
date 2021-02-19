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
  filterByName,
  filterByFile,
  filterByRank,
  extractOrigin,
  isDisambiguous,
  isCastlingMove,
  isKingsideCastlingMove,
  isQueensideCastlingMove,
  removeKingsideCastlingColor,
  removeQueensideCastlingColor,
} from './helpers'
import { check, identity, isDefined, pipe, pipeCond, when } from './utils'
import { findByCastling } from './helpers/moves'

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
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = ({ ...FENInfo }) =>
    (legalMoves = generateMoves({ rules, COLORS, ranks, files, board, ...FENInfo }))
  const selectPiece = (piece) => (activePiece = { ...piece })
  const deselectPiece = () => (activePiece = null)

  const removeCastling = () => updateCastling('-')
  const disallowCastling = pipe(
    removeCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )
  const disallowKingsideCastling = pipe(
    removeKingsideCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )
  const disallowQueensideCastling = pipe(
    removeQueensideCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )

  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const FromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isKingsideCastlingAvailable = () => FEN.castling[FEN.activeColor].isKingside
  const isQueensideCastlingAvailable = () => FEN.castling[FEN.activeColor].isQueenside
  const isCastlingAvailable = () => isKingsideCastlingAvailable() || isQueensideCastlingAvailable()

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
    const moves = rules[name]({ COLORS, board, color, y, x, FEN })

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
      disallowCastling,
      changeTurn,
      check(isWhiteTurn, incrementFullmove),
      updateLegalMoves
    )(board)

  const setCastlingSide = ({ isKingside, isQueenside }) => {
    const king = {
      y: FEN.activeColor === COLORS.w ? 7 : 0,
      x: 4,
    }
    const rook = { ...king, x: (isKingside && files.length - 1) || (isQueenside && 0) }
    const destination = {
      king: { ...king, x: (isKingside && files.length - 2) || (isQueenside && 2) },
      rook: { ...rook, x: (isKingside && files.length - 3) || (isQueenside && 3) },
    }
    return {
      king,
      rook,
      destination,
    }
  }
  const castling = (args) => pipe(setCastlingSide, executeCastling)(args)

  const hasKingMoved = ({ y, x }) => ({ activeColor }) =>
    board[y][x].name === NAMES.K && board[y][x].color === activeColor
  const hasKingsideRookMoved = ({ y, x, destination }) => ({ activeColor }) =>
    x === files.length - 1 &&
    y === (activeColor === COLORS.w ? files.length - 1 : 0) &&
    board[destination.y][destination.x].name === NAMES.R &&
    board[destination.y][destination.x].color === activeColor
  const hasQueensideRookMoved = ({ y, x, destination }) => ({ activeColor }) =>
    x === 0 &&
    y === (activeColor === COLORS.w ? files.length - 1 : 0) &&
    board[destination.y][destination.x].name === NAMES.R &&
    board[destination.y][destination.x].color === activeColor

  const move = ({ y, x, destination }) => {
    pipe(
      cleanBoard,
      removePieceFromBoard({ y, x }),
      addPieceToBoard({ ...board[y][x], ...destination }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      pipeCond(
        [when(isCastlingAvailable, hasKingMoved(destination)), disallowCastling, identity],
        [
          when(isKingsideCastlingAvailable, hasKingsideRookMoved({ y, x, destination })),
          disallowKingsideCastling,
          identity,
        ],
        [
          when(isQueensideCastlingAvailable, hasQueensideRookMoved({ y, x, destination })),
          disallowQueensideCastling,
          identity,
        ]
      ),
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
    const buildCastlingSAN = ({ castling: { isKingside, isQueenside } }) =>
      (isKingside && '0-0') || (isQueenside && '0-0-0')

    return pipe(
      check(
        findByCastling(piece),
        pipe(findByCastling(piece), buildCastlingSAN),
        pipeCond(
          [isDisambiguous, buildOriginName, filterByName(piece.name)],
          [isDisambiguous, buildOriginName, filterByFile(piece.x)],
          [isDisambiguous, buildOriginNameAndFile, filterByRank(piece.y)],
          [isDisambiguous, buildOriginNameFileAndRank]
        )
      )
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
        isCastlingMove,
        pipeCond(
          [when(isKingsideCastlingMove, isKingsideCastlingAvailable), castling, identity],
          [when(isQueensideCastlingMove, isQueensideCastlingAvailable), castling, identity]
        ),
        pipe(getMoves, check(isDisambiguous, pipe(extractOrigin, move)))
      ),
      deselect,
      getInfo
    ),
    getSAN,
  }
  return ret
}
