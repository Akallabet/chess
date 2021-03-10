import { bool, func, string } from 'prop-types'
import { withGame } from '../game'

import { Piece } from './piece'

const stopPropagation = (fn) => (e) => {
  e.stopPropagation()
  fn()
}

export const BoardPiece = withGame(
  ({
    name,
    color,
    file,
    rank,
    coordinates,
    selected,
    move,
    game: { selectPiece, deselectPiece },
  }) => {
    const handleClick = () => {
      if (selected) stopPropagation(deselectPiece())
      else if (!move) stopPropagation(selectPiece({ name, color, file, rank }))
    }
    return (
      <Piece
        name={name}
        color={color}
        label={`${name} ${color} ${coordinates}`}
        onClick={handleClick}
      />
    )
  }
)

BoardPiece.displayName = 'Piece'

BoardPiece.propTypes = {
  name: string.isRequired,
  color: string.isRequired,
  file: string.isRequired,
  rank: string.isRequired,
  coordinates: string.isRequired,
  selected: bool.isRequired,
  move: bool.isRequired,
  selectPiece: func,
  deselectPiece: func,
}

BoardPiece.defaultProps = {
  selected: false,
  move: false,
}
