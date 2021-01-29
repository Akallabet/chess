import { Cell } from './cell'
import { Letter, Notation, Number } from './notation'

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export const Row = ({ row, isOdd, rowIndex }) => (
  <div data-testid="row" className="flex flex-row">
    {row.map((cell, i) => {
      const isWhite = isOdd ? (i + 1) % 2 === 1 : (i + 1) % 2 === 0
      return (
        <Cell
          key={i}
          isWhite={isWhite}
          cell={cell}
          coordinates={{ y: rowIndex - 1, x: i, letter: letters[i], number: rowIndex }}
        >
          {i === 0 && <Number isWhite={!isWhite}>{rowIndex}</Number>}
          {rowIndex === 8 && <Letter isWhite={!isWhite}>{letters[i]}</Letter>}
        </Cell>
      )
    })}
  </div>
)
