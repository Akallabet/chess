import { isTruthy } from '../utils'

export { buildBoardFromFEN } from './build-board-from-FEN'
export { buildFENPiecePlacementFromBoard } from './buils-FEN-piece-placement-from-board'
export { addPieceToBoard } from './add-piece-to-board'
export { highligthMovesToBoard } from './highlight-moves-to-board'
export { cleanBoard } from './clean-board'
export { removePieceFromBoard } from './remove-piece-from-board'
export { createActions } from './create-actions'
export { generateMoves, filterByFile, filterByName, filterByRank } from './moves'
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
