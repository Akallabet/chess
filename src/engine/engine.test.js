import { engine } from './engine'

const emptyRow = [...Array(8)].map(() => ({ piece: false }))
const emptyBoard = [...Array(8)].map(() => emptyRow)

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
    board: [
      [
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
      ],
      [
        { piece: false },
        { piece: false },
        { piece: 'p', color: 'b' },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
      ],
      ...emptyBoard.slice(2, 8),
    ],
    FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = engine({ FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    activeColor: 'w',
    board: [
      [
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
        { piece: false },
      ],
      [
        { piece: false },
        { piece: false },
        { piece: 'p', color: 'b' },
        { piece: false },
        { piece: 'p', color: 'b' },
        { piece: false },
        { piece: false },
        { piece: false },
      ],
      ...emptyBoard.slice(2, 8),
    ],
    FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1',
  })
})

test('it should create a white pawn in a random place', () => {
  const initialFEN = '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1'
  const { createRandomPiece } = engine({ FEN: initialFEN })
  const { board, FEN } = createRandomPiece({ piece: 'p', color: 'w' })
  expect(board).not.toEqual([
    [
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
    ],
    [
      { piece: false },
      { piece: false },
      { piece: 'p', color: 'b' },
      { piece: false },
      { piece: 'p', color: 'b' },
      { piece: false },
      { piece: false },
      { piece: false },
    ],
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

test.skip('it should highlight the legal moves of a pawn', () => {
  const initialFEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'
  const { getLegalMoves } = engine({ FEN: initialFEN })
  const { board } = getLegalMoves({ y: 1, x: 2 })
  expect(board).toEqual([
    ...emptyRow,
    [
      { piece: false },
      { piece: false },
      { piece: 'p', color: 'b' },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
    ],
    [
      { piece: false },
      { piece: false },
      { piece: false, highlight: true },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
    ],
    [
      { piece: false },
      { piece: false },
      { piece: false, highlight: true },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
      { piece: false },
    ],
    ...emptyBoard.slice(4, 8),
  ])
})
