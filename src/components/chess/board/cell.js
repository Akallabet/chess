import clsx from 'clsx'
import { Piece } from '../pieces'
import { withGame } from '../../../game'
import { bool, func, node, number, oneOfType, shape, string } from 'prop-types'

export const Cell = withGame(
  ({ isWhite, cell: { piece, color, highlight }, coordinates, children, moveActivePiece }) => {
    const handleClick = highlight ? moveActivePiece : () => {}
    const classes = clsx('relative', 'h-full', 'w-1/8', {
      'bg-primary-dark': isWhite && highlight,
      'bg-primary': isWhite && !highlight,
      'bg-secondary-dark': !isWhite && highlight,
      'bg-secondary': !isWhite && !highlight,
    })
    return (
      <div
        data-testid={`${coordinates.letter}${coordinates.number}`}
        className={classes}
        onClick={() => handleClick(coordinates)}
      >
        {children}
        {piece ? (
          <Piece piece={piece} color={color} coordinates={coordinates} highlight={highlight} />
        ) : null}
      </div>
    )
  }
)

Cell.propTypes = {
  isWhite: bool.isRequired,
  cell: shape({
    piece: oneOfType([string, bool]).isRequired,
    color: string,
    highlight: bool,
  }).isRequired,
  coordinates: shape({
    y: number.isRequired,
    x: number.isRequired,
    number: number.isRequired,
    letter: string.isRequired,
  }).isRequired,
  children: node.isRequired,
  moveActivePiece: func,
}
