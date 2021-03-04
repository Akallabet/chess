import { rules as defaultRules } from './rules'
import {
  COLORS as defaultColors,
  FILES as defaultFiles,
  RANKS as defaultRanks,
  NAMES as defaultNames,
} from './constants'

import * as helpers from './helpers'
import { check, identity, isDefined, pipe, pipeCond, when } from './utils'

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
  const getMoves = helpers.buildGetMoves(rules)
  const actions = helpers.createActions({ pieces, ranks, files })
  const matchNotation = (notation) => ([regexp]) => new RegExp(regexp, 'g').test(notation)
  const fromSAN = (notation) => actions.find(matchNotation(notation))[1](notation)
  const toSAN = ({ y, x }) => `${files[x]}${ranks[y]}`

  let FEN = helpers.buildFENObject(initialFEN)(fromSAN)
  let board = initialBoard || helpers.buildBoardFromFEN({ pieces, COLORS, ...FEN })
  let legalMoves = helpers.generateMoves({ getMoves, COLORS, ranks, files, board, ...FEN })
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
    (legalMoves = helpers.generateMoves({ getMoves, COLORS, ranks, files, board, ...FENInfo }))

  const removeEnPassant = () => updateEnPassant(false)
  const removeCastling = () => updateCastling('-')
  const disallowCastling = pipe(
    helpers.removeCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )
  const disallowKingsideCastling = pipe(
    helpers.removeKingsideCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )
  const disallowQueensideCastling = pipe(
    helpers.removeQueensideCastlingColor,
    check(isDefined, updateCastling, removeCastling)
  )

  const isValidColor = ({ y, x }) => board[y][x].color === FEN.activeColor
  const isKingsideCastlingAvailable = () => FEN.castling[FEN.activeColor].isKingside
  const isQueensideCastlingAvailable = () => FEN.castling[FEN.activeColor].isQueenside
  const isCastlingAvailable = () => isKingsideCastlingAvailable() || isQueensideCastlingAvailable()
  const isWhiteTurn = ({ activeColor }) => activeColor === COLORS.w

  const getOrigins = ({ name, originY, originX, y, x }) =>
    pipe(
      helpers.filterByName(name),
      helpers.filterByFile(originX),
      helpers.filterByRank(originY)
    )(legalMoves[`${files[x]}${ranks[y]}`])

  const getPieceMoves = ({ x, y }) => ({
    moves: getMoves({ y, x, board, COLORS, FEN }),
    board,
  })

  const afterMove = pipe(changeTurn, check(isWhiteTurn, incrementFullmove), updateLegalMoves)

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

  const capture = ({ y, x, destination }) => {
    pipe(
      check(isEnPassant(destination), helpers.removePieceFromBoard({ y, x: destination.x })),
      helpers.removePieceFromBoard({ y, x }),
      helpers.addPieceToBoard({ ...board[y][x], ...destination }),
      updateBoard,
      helpers.buildFENPiecePlacementFromBoard({ pieces, COLORS }),
      updatePiecePlacement,
      removeEnPassant
    )(board)
  }

  const move = ({ y, x, destination }) => {
    pipe(
      helpers.removePieceFromBoard({ y, x }),
      helpers.addPieceToBoard({ ...board[y][x], ...destination }),
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
      )
    )(board)
  }

  const getSAN = (origin, destination) => {
    const { file, rank } = destination
    const piece = { ...origin, x: files.indexOf(origin.file), y: ranks.indexOf(origin.rank) }
    const buildOrigin = (origin) => `${origin}${file}${rank}`
    const buildOriginName = ([{ name, capture }]) => buildOrigin(`${name}${capture ? 'x' : ''}`)
    const buildOriginNameAndFile = ([{ name, x, capture }]) =>
      buildOrigin(`${name}${files[x]}${capture ? 'x' : ''}`)
    const buildOriginNameFileAndRank = ([{ name, y, x, capture }]) =>
      buildOrigin(`${name}${files[x]}${ranks[y]}${capture ? 'x' : ''}`)
    const buildCastlingSAN = ({ castling: { isKingside, isQueenside } }) =>
      (isKingside && '0-0') || (isQueenside && '0-0-0')
    const buildEnPassantSAN = ({ x }) => buildOrigin(`${files[x]}x`)

    return pipeCond(
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
    ...FEN,
    ...ret,
  })

  const ret = {
    getInfo,
    moves: pipe(fromSAN, check(isValidColor, pipe(getPieceMoves, helpers.highligthMoves), board)),
    move: pipe(
      fromSAN,
      pipeCond(
        [
          helpers.isKingsideCastlingMove,
          check(isKingsideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          helpers.isQueensideCastlingMove,
          check(isQueensideCastlingAvailable, pipe(castling, afterMove)),
          identity,
        ],
        [
          helpers.isCapture,
          pipe(
            getOrigins,
            check(helpers.isDisambiguous, pipe(helpers.extractOrigin, capture, afterMove))
          ),
          identity,
        ],
        [
          identity,
          pipe(
            getOrigins,
            check(helpers.isDisambiguous, pipe(helpers.extractOrigin, move, afterMove))
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
