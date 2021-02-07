import { addPieceToBoard } from './add-piece-to-board'
import { buildBoardFromFEN } from './build-board-from-FEN'
import { buildFENPiecePlacementFromBoard } from './buils-FEN-piece-placement-from-buard'
import { calculateMoves } from './calculare-moves'
import { cleanBoard } from './clean-board'
import { highligthMovesToBoard } from './highlight-moves-to-board'
import { removePieceFromBoard } from './remove-piece-from-board'

const createContext = (context) => (fns) => {
  const ret = {}
  for (const fn in fns) {
    ret[fn] = fns[fn](context)
  }
  return ret
}

export const createHelpers = ({ PIECES }) => {
  return createContext({ PIECES })({
    buildBoardFromFEN,
    buildFENPiecePlacementFromBoard,
    addPieceToBoard,
    removePieceFromBoard,
    cleanBoard,
    highligthMovesToBoard,
    calculateMoves,
  })
}
