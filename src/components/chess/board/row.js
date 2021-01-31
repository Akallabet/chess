import { arrayOf, bool, number, object } from 'prop-types'
import { Cell } from './cell'
import { Letter, Number } from './notation'

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export const Row = ({ row, isOdd, rowIndex }) => (
  <div data-testid="row" className="flex flex-row w-full h-1/8">
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

Row.propTypes = {
  row: arrayOf(object).isRequired,
  isOdd: bool.isRequired,
  rowIndex: number.isRequired,
}
