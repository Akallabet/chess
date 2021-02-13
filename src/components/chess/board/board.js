import { array, arrayOf } from 'prop-types'
import { withGame } from '../../../game'
import { Row } from './row'

export const Board = withGame(({ board, ranks }) => (
  <div
    data-testid="board"
    className="border-2 border-black flex flex-col w-full h-full-w sm:w-452 sm:h-452"
  >
    {board.map((row, i) => (
      <Row
        key={i}
        row={row}
        rank={ranks[i]}
        isLast={ranks[i] === ranks[ranks.length - 1]}
        isOdd={(i + 1) % 2 === 1}
      />
    ))}
  </div>
))

Board.propTypes = {
  board: arrayOf(array),
}
