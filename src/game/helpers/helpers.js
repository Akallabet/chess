import { createContext } from '../utils'

import { addPieceToBoard } from './add-piece-to-board'
import { buildBoardFromFEN } from './build-board-from-FEN'
import { buildFENPiecePlacementFromBoard } from './buils-FEN-piece-placement-from-board'
import { calculateMoves } from './calculare-moves'
import { cleanBoard } from './clean-board'
import { highligthMovesToBoard } from './highlight-moves-to-board'
import { removePieceFromBoard } from './remove-piece-from-board'

export const createHelpers = ({ PIECES }) =>
  createContext({ PIECES })({
    buildBoardFromFEN,
    buildFENPiecePlacementFromBoard,
    addPieceToBoard,
    removePieceFromBoard,
    cleanBoard,
    highligthMovesToBoard,
    calculateMoves,
  })
