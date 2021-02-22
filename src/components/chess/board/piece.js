import { bool, func, string } from 'prop-types'
import { withGame } from '../game'
import { Button } from '../../button'

import assets from './assets'

const stopPropagation = (fn) => (e) => {
  e.stopPropagation()
  fn()
}

export const Piece = withGame(
  ({
    name,
    color,
    coordinates,
    selected,
    move,
    game: { activePiece, selectPiece, deselectPiece, moveActivePiece },
  }) => {
    const handleClick = selected ? deselectPiece : move ? moveActivePiece : selectPiece
    return (
      <Button
        fullWidth
        fullHeight
        backGround={false}
        padding={false}
        borders={false}
        aria-label={`${name} ${color} ${coordinates}`}
        onClick={stopPropagation(() => {
          handleClick(`${move ? activePiece.name : ''}${move ? 'x' : ''}${coordinates}`)
        })}
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
