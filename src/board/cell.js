import { Pawn } from '../pieces/pawn'

export const Cell = ({ isWhite, cell: { piece, color }, children }) => {
  // if (color) console.log(color)
  return (
    <div
      data-testid={`cell-${isWhite ? 'white' : 'black'}`}
      className={`relative  w-14 h-14 ${isWhite ? 'bg-whiteCell' : 'bg-blackCell'}`}
    >
      {children}
      {piece ? <Pawn color={color} /> : null}
    </div>
  )
}
