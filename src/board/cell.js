import { Piece } from '../pieces/'
import withEngine from '../with-engine'

export const Cell = ({ isWhite, cell: { piece, color, highlight }, coordinates, children }) => {
  return (
    <div
      data-testid={`cell-${isWhite ? 'white' : 'black'}`}
      className={`relative  w-14 h-14 ${
        isWhite
          ? highlight
            ? 'bg-whiteCellHighlight'
            : 'bg-whiteCell'
          : highlight
          ? 'bg-blackCellHighlight'
          : 'bg-blackCell'
      }`}
    >
      {children}
      {piece ? <Piece piece={piece} color={color} coordinates={coordinates} /> : null}
    </div>
  )
}
