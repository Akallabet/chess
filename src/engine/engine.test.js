import { engine } from './engine'

const emptyBoard = [...Array(8)].map(() => [...Array(8)].map(() => 0))

test('it should return an empty board', () => {
  const { getInfo } = engine()
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: emptyBoard,
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  const { getInfo } = engine({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 'p', 0, 0, 0, 0, 0], ...emptyBoard.slice(2, 8)],
    FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = engine({ FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: [[0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 'p', 0, 'p', 0, 0, 0], ...emptyBoard.slice(2, 8)],
    FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should create a white pawn in a random place', () => {
  const initialFEN = '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1'
  const { createRandomPiece } = engine({ FEN: initialFEN })
  const { board, FEN } = createRandomPiece('p')
  expect(board).not.toEqual([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 'p', 0, 'p', 0, 0, 0],
    ...emptyBoard.slice(2, 8),
  ])
  const [piecePlacement, ...rest] = FEN.split(' ')
  expect(piecePlacement).not.toEqual(initialFEN.split(' ')[0])
  expect(rest[0]).toEqual(initialFEN.split(' ')[1])
  expect(rest[1]).toEqual(initialFEN.split(' ')[2])
  expect(rest[2]).toEqual(initialFEN.split(' ')[3])
  expect(rest[3]).toEqual(initialFEN.split(' ')[4])
  expect(rest[4]).toEqual(initialFEN.split(' ')[5])
})
