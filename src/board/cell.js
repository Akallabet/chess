export const Cell = ({ isWhite, children }) => {
  const color = isWhite ? 'bg-whiteCell' : 'bg-blackCell'
  return (
    <div
      data-testid={`cell-${isWhite ? 'white' : 'black'}`}
      className={`relative  w-14 h-14 ${color}`}
    >
      {children}
    </div>
  )
}
