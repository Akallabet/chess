import { arrayOf, bool, number, object } from 'prop-types'
import { Square } from './square'
import { Letter, Number } from './notation'

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

export const Row = ({ row, isOdd, rank }) => (
  <div data-testid="row" className="flex flex-row w-full h-1/8">
    {row.map((cell, i) => {
      const isWhite = isOdd ? (i + 1) % 2 === 1 : (i + 1) % 2 === 0
      return (
        <Square key={i} isWhite={isWhite} cell={cell} coordinates={`${files[i]}${rank}`}>
          {i === 0 && <Number isWhite={!isWhite}>{rank}</Number>}
          {rank === 8 && <Letter isWhite={!isWhite}>{files[i]}</Letter>}
        </Square>
      )
    })}
  </div>
)

Row.propTypes = {
  row: arrayOf(object).isRequired,
  isOdd: bool.isRequired,
  rank: number.isRequired,
}
