import { engine } from './engine'

const emptyBoard = [...Array(8)].map(() => [...Array(8)].map(() => 0))

test('it should return an empty board', () => {
  expect(engine()).toEqual({
    activeColor: 'w',
    board: emptyBoard,
    fen: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  expect(engine({ fen: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })).toEqual({
    activeColor: 'w',
    board: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 'p', 0, 0, 0, 0, 0], ...emptyBoard.slice(2, 8)],
    fen: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
  })
})
