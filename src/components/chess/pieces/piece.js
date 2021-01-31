import { func, number, shape, string } from 'prop-types'
import { PIECES, withGame } from '../../../game'
import { Button } from '../../button'

import { Pawn } from './pawn'

const pieceComponents = {
  [PIECES.p.name]: Pawn,
}

export const Piece = withGame(
  ({
    piece,
    color,
    coordinates: { number, letter, y, x },
    activePiece,
    selectPiece,
    deselectPiece,
  }) => {
    const PieceComponent = pieceComponents[piece]
    const deselectAndStop = ({ x, y, e }) => {
      e.stopPropagation()
      deselectPiece({ y, x })
    }
    const handleClick = activePiece
      ? activePiece.y === y && activePiece.x === x
        ? deselectAndStop
        : selectPiece
      : selectPiece
    return (
      <Button
        fullWidth
        fullHeight
        backGround={false}
        padding={false}
        borders={false}
        aria-label={`${piece} ${color} ${letter}${number}`}
        onClick={(e) => handleClick({ y, x, e })}
      >
        <PieceComponent color={color} />
      </Button>
    )
  }
)

Piece.propTypes = {
  piece: string.isRequired,
  color: string.isRequired,
  coordinates: shape({
    y: number.isRequired,
    x: number.isRequired,
    number: number.isRequired,
    letter: string.isRequired,
  }).isRequired,
  activePiece: shape({
    y: string.isRequired,
    x: string.isRequired,
  }),
  selectPiece: func,
  deselectPiece: func,
}
