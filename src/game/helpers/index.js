import { isTruthy } from '../utils'

export { findPosition, movePiece, addPieceToBoard, removePieceFromBoard, cleanBoard } from './board'
export { buildBoardFromFEN } from './build-board-from-FEN'
export { buildFENPiecePlacementFromBoard } from './buils-FEN-piece-placement-from-board'
export { highligthMovesToBoard as highligthMoves } from './highlight-moves-to-board'
export { createActions } from './create-actions'
export {
  generateLegalMoves,
  filterByFile,
  filterByName,
  filterByRank,
  findByCastling,
  findByEnPassant,
  buildGetMoves,
} from './moves'
export {
  buildFENObject,
  buildFENString,
  removeCastlingColor,
  removeKingsideCastlingColor,
  removeQueensideCastlingColor,
} from './fen'

export const extractOrigin = (origins) => origins[0]
export const isDisambiguous = (origins) => origins.length === 1
export const isCastlingMove = ({ isCastling }) => isCastling
export const isKingsideCastlingMove = ({ isKingside }) => isTruthy(isKingside)
export const isQueensideCastlingMove = ({ isQueenside }) => isTruthy(isQueenside)
export const isCapture = ({ capture }) => isTruthy(capture)
export const isCheck = ({ check }) => () => isTruthy(check)
