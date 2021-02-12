import clsx from 'clsx'
import { Piece } from '../piece'
import { withGame } from '../../../game'
import { bool, func, node, shape, string } from 'prop-types'

export const Square = withGame(
  ({
    isWhite,
    cell: { name, color, move, selected },
    coordinates,
    children,
    activePiece,
    moveActivePiece,
  }) => {
    const highlight = selected || move
    const handleClick = highlight ? moveActivePiece : () => {}
    const classes = clsx('relative', 'h-full', 'w-1/8', {
      'bg-primary-dark': isWhite && highlight,
      'bg-primary': isWhite && !highlight,
      'bg-secondary-dark': !isWhite && highlight,
      'bg-secondary': !isWhite && !highlight,
    })
    return (
      <div
        data-testid={coordinates}
        className={classes}
        onClick={() => handleClick(`${activePiece ? activePiece.name : ''}${coordinates}`)}
      >
        {children}
        {name ? (
          <Piece
            name={name}
            color={color}
            coordinates={coordinates}
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
  cell: shape({
    name: string,
    color: string,
    selected: bool,
    move: bool,
  }).isRequired,
  coordinates: string.isRequired,
  children: node.isRequired,
  moveActivePiece: func,
}
