export const Cell = ({ isWhite }) => {
  const color = isWhite ? 'bg-whiteCell' : 'bg-blackCell'
  return (
    <div data-testid={`cell-${isWhite ? 'white' : 'black'}`} className={`w-14 h-14 ${color}`} />
  )
}
