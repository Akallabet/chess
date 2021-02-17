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
  isCastlingAvailable, // isKingsideCastlingColorAvailable,
} from './fen'
