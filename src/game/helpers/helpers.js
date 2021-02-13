import { addPieceToBoard } from './add-piece-to-board'
import { buildBoardFromFEN } from './build-board-from-FEN'
import { buildFENPiecePlacementFromBoard } from './buils-FEN-piece-placement-from-board'
import { cleanBoard } from './clean-board'
import { highligthMovesToBoard } from './highlight-moves-to-board'
import { removePieceFromBoard } from './remove-piece-from-board'
import { actions } from './actions'
import { getLegalMoves } from './get-legal-moves'

export const helpers = {
  addPieceToBoard,
  buildBoardFromFEN,
  buildFENPiecePlacementFromBoard,
  cleanBoard,
  highligthMovesToBoard,
  removePieceFromBoard,
  getLegalMoves,
  actions,
}
