import { bool, func, number, shape, string } from 'prop-types'
import { withGame } from '../../../game'
import { Button } from '../../button'

import whitePawn from './assets/white/white-pawn.svg'
import blackPawn from './assets/black/black-pawn.svg'

const assets = {
  w: {
    P: whitePawn,
  },
  b: {
    P: blackPawn,
  },
}

const stopPropagation = (fn) => (e) => {
  e.stopPropagation()
  fn()
}

export const Piece = withGame(
  ({ name, color, coordinates, selected, move, selectPiece, deselectPiece, movePiece }) => {
    const handleClick = selected ? deselectPiece : move ? movePiece : selectPiece

    return (
      <Button
        fullWidth
        fullHeight
        backGround={false}
        padding={false}
        borders={false}
        aria-label={`${name} ${color} ${coordinates}`}
        onClick={stopPropagation(() => handleClick(`${coordinates}`))}
      >
        <img src={assets[color][name]} className="w-full h-full" />
      </Button>
    )
  }
)

Piece.displayName = 'Piece'

Piece.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  coordinates: string.isRequired,
  selected: bool.isRequired,
  move: bool.isRequired,
  selectPiece: func,
  deselectPiece: func,
}

Piece.defaultProps = {
  selected: false,
  move: false,
}
