import { PIECES, withEngine } from '../../engine'
import { Button } from '../button'

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
      <Button
        fullWidth
        fullHeight
        aria-label={`${piece} ${color} ${letter}${number}`}
        onClick={() => handleClick({ y, x })}
      >
        <PieceComponent color={color} />
      </Button>
    )
  }
)
