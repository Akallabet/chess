import { Cell } from './cell'

export const Row = ({ row, isOdd }) => (
  <div data-testid="row" className="flex flex-row">
    {row.map((_, i) => (
      <Cell key={i} isWhite={isOdd ? (i + 1) % 2 === 1 : (i + 1) % 2 === 0} />
    ))}
  </div>
)
