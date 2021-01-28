import { Piece } from '../pieces/'
import withEngine from '../with-engine'

export const Cell = withEngine(
  ({ isWhite, cell: { piece, color, highlight }, coordinates, children, moveActivePiece }) => {
    const handleClick = highlight ? moveActivePiece : () => {}
    return (
      <div
        data-testid={`${coordinates.letter}${coordinates.number}`}
        className={`relative  w-14 h-14 ${
          isWhite
            ? highlight
              ? 'bg-whiteCellHighlight'
              : 'bg-whiteCell'
            : highlight
            ? 'bg-blackCellHighlight'
            : 'bg-blackCell'
        }`}
        onClick={() => handleClick(coordinates)}
      >
        {children}
        {piece ? <Piece piece={piece} color={color} coordinates={coordinates} /> : null}
      </div>
    )
  }
)
