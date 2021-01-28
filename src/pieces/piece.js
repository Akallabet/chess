import { PIECES } from '../engine'
import withEngine from '../with-engine'

import { Pawn } from './pawn'

const pieceComponents = {
  [PIECES.p.name]: Pawn,
}

export const Piece = withEngine(
  ({
    piece,
    color,
    coordinates: { number, letter, y, x },
    activePiece,
    selectPiece,
    deselectPiece,
  }) => {
    const PieceComponent = pieceComponents[piece]
    const handleClick = !activePiece
      ? selectPiece
      : activePiece && activePiece.y === y && activePiece.x === x
      ? deselectPiece
      : () => {}
    return (
      <button
        className="w-full h-full"
        aria-label={`${piece} ${color} ${letter}${number}`}
        onClick={() => handleClick({ y, x })}
      >
        <PieceComponent color={color} />
      </button>
    )
  }
)
