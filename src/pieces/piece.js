import { PIECES } from '../engine'
import withEngine from '../with-engine'

import { Pawn } from './pawn'

const pieceComponents = {
  [PIECES.p.name]: Pawn,
}

export const Piece = withEngine(
  ({ piece, color, coordinates: { number, letter, y, x }, selectPiece }) => {
    const PieceComponent = pieceComponents[piece]
    return (
      <button
        className="w-full h-full"
        aria-label={`${piece} ${color} ${letter}${number}`}
        onClick={() => selectPiece({ y, x })}
      >
        <PieceComponent color={color} />
      </button>
    )
  }
)
