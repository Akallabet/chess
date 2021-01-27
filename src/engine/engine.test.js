import { engine } from './engine'

const emptyBoard = [...Array(8)].map(() => [...Array(8)].map(() => 0))

test('it should return an empty board', () => {
  const { getInfo } = engine()
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: emptyBoard,
    fen: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  const { getInfo } = engine({ fen: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 'p', 0, 0, 0, 0, 0], ...emptyBoard.slice(2, 8)],
    fen: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = engine({ fen: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 'p', 0, 'p', 0, 0, 0], ...emptyBoard.slice(2, 8)],
    fen: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should create a white pawn in a random place', () => {
  const initialFen = '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1'
  const { createRandomPawn } = engine({ fen: initialFen })
  const { board, fen } = createRandomPawn()
  expect(board).not.toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 'p', 0, 'p', 0, 0, 0],
    ...emptyBoard.slice(2, 8),
  ])
  expect(fen.split(' ')[0]).not.toEqual(initialFen.split(' ')[0])
})
