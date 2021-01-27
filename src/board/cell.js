import { Pawn } from '../pieces/pawn'

export const Cell = ({ isWhite, cell, children }) => {
  const color = isWhite ? 'bg-whiteCell' : 'bg-blackCell'
  return (
    <div
      data-testid={`cell-${isWhite ? 'white' : 'black'}`}
      className={`relative  w-14 h-14 ${color}`}
    >
      {children}
      {cell ? <Pawn color={cell} /> : null}
    </div>
  )
}
