import { array, arrayOf } from 'prop-types'
import { withGame } from '../../../game'
import { Row } from './row'

export const Board = withGame(({ board }) => (
  <div
    data-testid="board"
    className="border-2 border-black flex flex-col w-full h-full-w sm:w-452 sm:h-452"
  >
    {board.map((row, i) => (
      <Row key={i} row={row} rank={i + 1} isOdd={(i + 1) % 2 === 1} />
    ))}
  </div>
))

Board.propTypes = {
  board: arrayOf(array),
}
