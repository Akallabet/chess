import clsx from 'clsx'
import { Piece } from '../pieces'
import { withEngine } from '../../../engine'

export const Cell = withEngine(
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
        {piece ? <Piece piece={piece} color={color} coordinates={coordinates} /> : null}
      </div>
    )
  }
)
