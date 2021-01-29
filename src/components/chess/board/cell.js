import clsx from 'clsx'
import { Piece } from '../pieces'
import { withEngine } from '../../../engine'

export const Cell = withEngine(
  ({ isWhite, cell: { piece, color, highlight }, coordinates, children, moveActivePiece }) => {
    const handleClick = highlight ? moveActivePiece : () => {}
    const classes = clsx('relative', 'w-14', 'h-14', {
      'bg-whiteCellHighlight': isWhite && highlight,
      'bg-whiteCell': isWhite && !highlight,
      'bg-blackCellHighlight': !isWhite && highlight,
      'bg-blackCell': !isWhite && !highlight,
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
