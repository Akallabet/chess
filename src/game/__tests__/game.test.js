import { game } from '../game'

const emptyRow = [...Array(8)].map(() => ({}))
const emptyBoard = [...Array(8)].map(() => emptyRow)

const highlightedBoard = [
  [...emptyRow],
  [{}, {}, { name: 'p', color: 'b', highlight: true }, {}, {}, {}, {}, {}],
  [{}, {}, { highlight: true }, {}, {}, {}, {}, {}],
  [{}, {}, { highlight: true }, {}, {}, {}, {}, {}],
  ...emptyBoard.slice(4, 8),
]

const completeBoard = [
  [
    { name: 'r', color: 'b' },
    { name: 'n', color: 'b' },
    { name: 'b', color: 'b' },
    { name: 'q', color: 'b' },
    { name: 'k', color: 'b' },
    { name: 'b', color: 'b' },
    { name: 'n', color: 'b' },
    { name: 'r', color: 'b' },
  ],
  [...Array(8)].map(() => ({ name: 'p', color: 'b' })),
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [...Array(8)].map(() => ({ name: 'P', color: 'w' })),
  [
    { name: 'R', color: 'w' },
    { name: 'N', color: 'w' },
    { name: 'B', color: 'w' },
    { name: 'Q', color: 'w' },
    { name: 'K', color: 'w' },
    { name: 'B', color: 'w' },
    { name: 'N', color: 'w' },
    { name: 'R', color: 'w' },
  ],
]

const boardWithBlackPawn = [
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, { name: 'p', color: 'b' }, {}, {}, {}, {}, {}],
  ...emptyBoard.slice(2, 8),
]
test('it should return an empty board', () => {
  const { getInfo } = game({ FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: emptyBoard,
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  const { getInfo } = game({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: boardWithBlackPawn,
    FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = game({ FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: [
      [{}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, { name: 'p', color: 'b' }, {}, { name: 'p', color: 'b' }, {}, {}, {}],
      ...emptyBoard.slice(2, 8),
    ],
    FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with all the standard pieces', () => {
  const { getInfo } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: completeBoard,
    FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should highlight the legal moves of a piece', () => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  const { select } = game({ FEN: initialFEN })
  const { board } = select('a2')

  expect(board).toEqual([
    [...completeBoard[0]],
    [{ name: 'p', color: 'b', highlight: true }, ...completeBoard[1].slice(1)],
    [{ highlight: true }, ...emptyRow.slice(1)],
    [{ highlight: true }, ...emptyRow.slice(1)],
    [...emptyRow],
    [...emptyRow],
    ...completeBoard.slice(6),
  ])
})

test('it should deselect the legal moves of a piece', () => {
  const initialFEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'
  const { select, deselect } = game({ FEN: initialFEN })
  const { board } = select('c2')
  expect(board).toEqual(highlightedBoard)
  const info = deselect()
  expect(info.board).toEqual(boardWithBlackPawn)
})

test('it should move white pawn c7 to c4', () => {
  const { move } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  const { board, FEN } = move('c5')

  const expectedBoard = [
    ...completeBoard.slice(0, 4),
    [{}, {}, { name: 'P', color: 'w' }, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}],
    [
      { name: 'P', color: 'w' },
      { name: 'P', color: 'w' },
      {},
      { name: 'P', color: 'w' },
      { name: 'P', color: 'w' },
      { name: 'P', color: 'w' },
      { name: 'P', color: 'w' },
      { name: 'P', color: 'w' },
    ],
    [...completeBoard[7]],
  ]
  expect(board).toEqual(expectedBoard)
  expect(FEN).toEqual('rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 1')
})
