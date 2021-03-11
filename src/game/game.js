import { rules as defaultRules } from './rules'
import {
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
  NAMES as defaultNames,
} from './constants'

import * as helpers from './helpers'
import { ifElse, identity, isDefined, pipe, pipeCond, when, isTruthy } from './utils'

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
  const actions = helpers.createActions({ pieces, ranks, files })
  const generateLegalMoves = (FEN) =>
    (legalMoves = helpers.generateLegalMoves({
      rules,
      COLORS,
      NAMES,
      ranks,
      files,
      board,
      ...FEN,
    }))
  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const fromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const toSAN = ({ y, x }) => `${files[x]}${ranks[y]}`

  let FEN = helpers.buildFENObject(initialFEN)(fromSAN)
  let board = initialBoard || helpers.buildBoardFromFEN({ pieces, COLORS, ...FEN })
  let isInCheck = false
  let legalMoves = generateLegalMoves(FEN)
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
  const updateLegalMoves = (args) => (legalMoves = generateLegalMoves(args))
  const removeCheck = () => (isInCheck = false)
  const addCheck = () => (isInCheck = true)

  const removeEnPassant = () => updateEnPassant(false)
  const removeCastling = () => updateCastling('-')
  const disallowCastling = pipe(
    helpers.removeCastlingColor,
    ifElse(isDefined, updateCastling, removeCastling)
  )
  const disallowKingsideCastling = pipe(
    helpers.removeKingsideCastlingColor,
    ifElse(isDefined, updateCastling, removeCastling)
  )
  const disallowQueensideCastling = pipe(
    helpers.removeQueensideCastlingColor,
    ifElse(isDefined, updateCastling, removeCastling)
  )

  const isLegalMove = ({ y, x }) => legalMoves[`${files[x]}${ranks[y]}`].length
  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isKingsideCastlingAvailable = () => FEN.castling[FEN.activeColor].isKingside
  const isQueensideCastlingAvailable = () => FEN.castling[FEN.activeColor].isQueenside
  const isCastlingAvailable = () => isKingsideCastlingAvailable() || isQueensideCastlingAvailable()
  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w

  const getOrigins = (args) => helpers.getOrigins(files, ranks, legalMoves)(args)

  const highligthMoves = (origin) =>
    pipe(
      ifElse(
        isValidColor,
        pipe(helpers.getPieceMoves(legalMoves), helpers.highligthMoves(board)),
        () => board
      )
    )(origin)

  const afterMove = pipe(changeTurn, ifElse(isWhiteTurn, incrementFullmove), updateLegalMoves)

  const castling = (args) => {
    const executeCastling = ({ king, rook, destination }) =>
      pipe(
        helpers.cleanBoard,
        helpers.removePieceFromBoard(king),
        helpers.removePieceFromBoard(rook),
        helpers.addPieceToBoard({
          name: NAMES.K,
          color: FEN.activeColor,
          ...king,
          ...destination.king,
        }),
        helpers.addPieceToBoard({
          name: NAMES.R,
          color: FEN.activeColor,
          ...rook,
          ...destination.rook,
        }),
        updateBoard,
        helpers.buildFENPiecePlacementFromBoard({ pieces, COLORS }),
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

  const capture = ({ y, x, destination, ...move }) => {
    pipe(
      ifElse(isEnPassant(destination), helpers.removePieceFromBoard({ y, x: destination.x })),
      helpers.movePiece(board[y][x], { y, x }, destination),
      updateBoard,
      helpers.buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      removeEnPassant,
      ifElse(helpers.isCheck(move), addCheck, removeCheck)
    )(board)
  }

  // const isPromotion = (promotion) => () => isTruthy(promotion)

  const move = ({ y, x, destination, promotion, ...move }) => {
    // console.log('is promotion', promotion)
    pipe(
      helpers.movePiece(board[y][x], { y, x }, destination),
      ifElse(
        () => isTruthy(promotion),
        helpers.addPieceToBoard({ name: promotion, color: FEN.activeColor, ...destination }),
        identity
      ),
      updateBoard,
      helpers.buildFENPiecePlacementFromBoard({ pieces, COLORS }),
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
      ),
      ifElse(helpers.isCheck(move), addCheck, removeCheck)
    )(board)
  }

  const getSAN = (origin, destination) => {
    const { file, rank } = destination
    const piece = { ...origin, x: files.indexOf(origin.file), y: ranks.indexOf(origin.rank) }
    const buildOrigin = (origin, check) => `${origin}${file}${rank}${check ? '+' : ''}`
    const buildOriginName = ([{ name, capture, check }]) =>
      buildOrigin(`${name}${capture ? 'x' : ''}`, check)
    const buildOriginNameAndFile = ([{ name, x, capture, check }]) =>
      buildOrigin(`${name}${files[x]}${capture ? 'x' : ''}`, check)
    const buildOriginNameFileAndRank = ([{ name, y, x, capture, check }]) =>
      buildOrigin(`${name}${files[x]}${ranks[y]}${capture ? 'x' : ''}`, check)
    const buildCastlingSAN = ({ castling: { isKingside, isQueenside } }) =>
      (isKingside && '0-0') || (isQueenside && '0-0-0')
    const buildEnPassantSAN = ({ x, check }) => buildOrigin(`${files[x]}x`, check)
    const buildPromotion = ({ promotion, check }) => `${file}${rank}${check ? '+' : ''}${promotion}`

    return pipeCond(
      [
        () =>
          ranks.indexOf(destination.rank) ===
            (FEN.activeColor === COLORS.w ? 0 : ranks.length - 1) && origin.name === NAMES.P,
        (moves) =>
          moves
            .filter(({ name }) => name === NAMES.P)
            .map((info) => ({ ...info, SAN: buildPromotion(info) })),
        identity,
      ],
      [
        helpers.findByEnPassant(piece),
        pipe(helpers.findByEnPassant(piece), buildEnPassantSAN),
        identity,
      ],
      [
        helpers.findByCastling(piece),
        pipe(helpers.findByCastling(piece), buildCastlingSAN),
        identity,
      ],
      [helpers.isDisambiguous, buildOriginName, helpers.filterByName(piece.name)],
      [helpers.isDisambiguous, buildOriginName, helpers.filterByFile(piece.x)],
      [helpers.isDisambiguous, buildOriginNameAndFile, helpers.filterByRank(piece.y)],
      [helpers.isDisambiguous, buildOriginNameFileAndRank]
    )(legalMoves[`${file}${rank}`])
  }

  const getInfo = () => ({
    files,
    ranks,
    FEN: helpers.buildFENString(FEN)(toSAN),
    board,
    legalMoves,
    capturedPieces,
    isInCheck,
    ...FEN,
    ...ret,
  })

  const ret = {
    getInfo,
    moves: pipe(fromSAN, highligthMoves),
    move: pipe(
      fromSAN,
      pipeCond(
        [
          helpers.isKingsideCastlingMove,
          ifElse(isKingsideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          helpers.isQueensideCastlingMove,
          ifElse(isQueensideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          when(helpers.isCapture, isLegalMove),
          pipe(
            getOrigins,
            ifElse(helpers.isDisambiguous, pipe(helpers.extractOrigin, capture, afterMove))
          ),
          identity,
        ],
        [
          isLegalMove,
          pipe(
            getOrigins,
            ifElse(helpers.isDisambiguous, pipe(helpers.extractOrigin, move, afterMove))
          ),
          identity,
        ]
      ),
      getInfo
    ),
    getSAN,
  }
  return ret
}
