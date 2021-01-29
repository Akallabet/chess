import { Row } from './row'

export const Board = ({ board }) => (
  <div data-testid="board" className="border-2 border-black inline-flex  flex-col">
    {board.map((row, i) => (
      <Row key={i} row={row} rowIndex={i + 1} isOdd={(i + 1) % 2 === 1} />
    ))}
  </div>
)
