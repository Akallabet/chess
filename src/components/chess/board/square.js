import clsx from 'clsx'
import { Piece } from './piece'
import { withGame } from '../game'
import { bool, func, node, shape, string } from 'prop-types'

export const Square = withGame(
  ({
    isWhite,
    name,
    color,
    meta: { move, selected },
    rank,
    file,
    children,
    game: { getSAN, activePiece, moveActivePiece },
  }) => {
    const handleMove = () => {
      moveActivePiece(getSAN(activePiece, { file, rank }))
    }
    const highlight = selected || move
    const classes = clsx('relative', 'h-full', 'w-1/8', {
      'bg-primary-dark': isWhite && highlight,
      'bg-primary': isWhite && !highlight,
      'bg-secondary-dark': !isWhite && highlight,
      'bg-secondary': !isWhite && !highlight,
    })
    return (
      <div
        data-testid={`${file}${rank}`}
        className={classes}
        onClick={highlight ? handleMove : () => {}}
      >
        {children}
        {name ? (
          <Piece
            name={name}
            color={color}
            coordinates={`${file}${rank}`}
            selected={selected}
            move={move}
          />
        ) : null}
      </div>
    )
  }
)

Square.displayName = 'Square'

Square.propTypes = {
  isWhite: bool.isRequired,
  name: string,
  color: string,
  meta: shape({
    selected: bool,
    move: bool,
  }).isRequired,
  rank: string.isRequired,
  file: string.isRequired,
  moveActivePiece: func,
  children: node.isRequired,
}
