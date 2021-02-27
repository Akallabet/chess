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
  highligthMoves,
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
  isKingsideCastlingMove,
  isQueensideCastlingMove,
  removeKingsideCastlingColor,
  removeQueensideCastlingColor,
  isCapture,
} from './helpers'
import { check, identity, isDefined, pipe, pipeCond, when } from './utils'
import { findByCastling, findByEnPassant } from './helpers/moves'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  pieces = defaultNames,
  COLORS = defaultColors,
  files = defaultFiles,
  ranks = defaultRanks,
  NAMES = defaultNames,
  rules = defaultRules,
}) => {
  const actions = createActions({ pieces, ranks, files })
  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const fromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const toSAN = ({ y, x }) => `${files[x]}${ranks[y]}`

  let FEN = buildFENObject(initialFEN)(fromSAN)
  let board = initialBoard || buildBoardFromFEN({ pieces, COLORS, ...FEN })
  let legalMoves = generateMoves({ rules, COLORS, ranks, files, board, ...FEN })
  const capturedPieces = initialCapturedPieces || []

  const updateFEN = (parts) => (FEN = { ...FEN, ...parts })
  const updatePiecePlacement = (piecePlacement) => updateFEN({ piecePlacement })
  const changeTurn = () =>
    updateFEN({ activeColor: FEN.activeColor === COLORS.w ? COLORS.b : COLORS.w })
  const incrementFullmove = ({ fullmoveNumber }) =>
    updateFEN({ fullmoveNumber: fullmoveNumber + 1 })
  const updateEnPassant = (enPassant) => updateFEN({ enPassant })
  const updateCastling = (castling) => updateFEN({ castling })
  const updateBoard = (newBoard) => (board = newBoard)
  const updateLegalMoves = ({ ...FENInfo }) =>
    (legalMoves = generateMoves({ rules, COLORS, ranks, files, board, ...FENInfo }))

  const removeEnPassant = () => updateEnPassant(false)
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

  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isKingsideCastlingAvailable = () => FEN.castling[FEN.activeColor].isKingside
  const isQueensideCastlingAvailable = () => FEN.castling[FEN.activeColor].isQueenside
  const isCastlingAvailable = () => isKingsideCastlingAvailable() || isQueensideCastlingAvailable()
  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w

  const getMoves = ({ name, originY, originX, y, x }) =>
    pipe(
      filterByName(name),
      filterByFile(originX),
      filterByRank(originY)
    )(legalMoves[`${files[x]}${ranks[y]}`])

  const moves = ({ y, x }) =>
    highligthMoves({
      y,
      x,
      moves: rules[board[y][x].name]({ COLORS, board, color: board[y][x].color, y, x, FEN }),
    })(board)

  const afterMove = pipe(changeTurn, check(isWhiteTurn, incrementFullmove), updateLegalMoves)

  const castling = (args) => {
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
        removeEnPassant
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

    pipe(setCastlingSide, executeCastling)(args)
  }

  const hasPieceMoved = (name) => ({ y, x }) => () => board[y][x].name === name
  const hasKingMoved = hasPieceMoved(NAMES.K)
  const hasRookMoved = hasPieceMoved(NAMES.R)
  const hasPawnMoved = hasPieceMoved(NAMES.P)
  const isKingsideRook = ({ x }) => () => x === files.length - 1
  const isQueensideRook = ({ x }) => () => x === 0
  const isEnPassant = ({ y, x }) => () =>
    FEN.enPassant && FEN.enPassant.y === y && FEN.enPassant.x === x
  const isEnPassantMove = ({ y, destination }) => () => Math.abs(destination.y - y) === 2
  const getEnPassantSquare = ({ y, x }, colors) => ({ activeColor }) => ({
    x,
    y: activeColor === colors.w ? y + 1 : y - 1,
  })

  const capture = ({ y, x, destination }) => {
    pipe(
      check(isEnPassant(destination), removePieceFromBoard({ y, x: destination.x })),
      removePieceFromBoard({ y, x }),
      addPieceToBoard({ ...board[y][x], ...destination }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      removeEnPassant
    )(board)
  }

  const move = ({ y, x, destination }) => {
    pipe(
      removePieceFromBoard({ y, x }),
      addPieceToBoard({ ...board[y][x], ...destination }),
      updateBoard,
      buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      removeEnPassant,
      pipeCond(
        [when(isCastlingAvailable, hasKingMoved(destination)), disallowCastling, identity],
        [
          when(isKingsideCastlingAvailable, hasRookMoved(destination), isKingsideRook({ x, y })),
          disallowKingsideCastling,
          identity,
        ],
        [
          when(isQueensideCastlingAvailable, hasRookMoved(destination), isQueensideRook({ x, y })),
          disallowQueensideCastling,
          identity,
        ],
        [
          when(hasPawnMoved(destination), isEnPassantMove({ y, destination })),
          pipe(getEnPassantSquare(destination, COLORS), updateEnPassant),
          identity,
        ]
      )
    )(board)
  }

  const getSAN = (origin, destination) => {
    const { file, rank } = destination
    const piece = { ...origin, x: files.indexOf(origin.file), y: ranks.indexOf(origin.rank) }
    const buildOrigin = (origin) => `${origin}${file}${rank}`
    const buildOriginName = ([{ name }]) => buildOrigin(`${name}`)
    const buildOriginNameAndFile = ([{ name, x }]) => buildOrigin(`${name}${files[x]}`)
    const buildOriginNameFileAndRank = ([{ name, y, x }]) =>
      buildOrigin(`${name}${files[x]}${ranks[y]}`)
    const buildCastlingSAN = ({ castling: { isKingside, isQueenside } }) =>
      (isKingside && '0-0') || (isQueenside && '0-0-0')
    const buildEnPassantSAN = ({ x }) => buildOrigin(`${files[x]}x`)

    return pipeCond(
      [findByEnPassant(piece), pipe(findByEnPassant(piece), buildEnPassantSAN), identity],
      [findByCastling(piece), pipe(findByCastling(piece), buildCastlingSAN), identity],
      [isDisambiguous, buildOriginName, filterByName(piece.name)],
      [isDisambiguous, buildOriginName, filterByFile(piece.x)],
      [isDisambiguous, buildOriginNameAndFile, filterByRank(piece.y)],
      [isDisambiguous, buildOriginNameFileAndRank]
    )(legalMoves[`${file}${rank}`])
  }

  const getInfo = () => ({
    files,
    ranks,
    FEN: buildFENString(FEN)(toSAN),
    board,
    legalMoves,
    capturedPieces,
    ...FEN,
    ...ret,
  })

  const ret = {
    getInfo,
    moves: pipe(fromSAN, check(isValidColor, moves, board)),
    move: pipe(
      fromSAN,
      pipeCond(
        [
          isKingsideCastlingMove,
          check(isKingsideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          isQueensideCastlingMove,
          check(isQueensideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          isCapture,
          pipe(getMoves, check(isDisambiguous, pipe(extractOrigin, capture, afterMove))),
          identity,
        ],
        [
          identity,
          pipe(getMoves, check(isDisambiguous, pipe(extractOrigin, move, afterMove))),
          identity,
        ]
      ),
      getInfo
    ),
    getSAN,
  }
  return ret
}
