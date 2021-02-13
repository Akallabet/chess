import { arrayOf, bool, object, string } from 'prop-types'
import { Square } from './square'
import { Rank, File } from './notation'
import { withGame } from '../../../game'

export const Row = withGame(({ row, isOdd, isLast, rank, files }) => (
  <div data-testid="row" className="flex flex-row w-full h-1/8">
    {row.map((cell, i) => {
      const isWhite = isOdd ? (i + 1) % 2 === 1 : (i + 1) % 2 === 0
      return (
        <Square key={i} isWhite={isWhite} cell={cell} rank={rank} file={files[i]}>
          {i === 0 && <Rank isWhite={!isWhite}>{rank}</Rank>}
          {isLast && <File isWhite={!isWhite}>{files[i]}</File>}
        </Square>
      )
    })}
  </div>
))

Row.propTypes = {
  row: arrayOf(object).isRequired,
  isOdd: bool.isRequired,
  isLast: bool.isRequired,
  rank: string.isRequired,
}
