import { game } from '../game'

const emptyRow = [...Array(8)].map(() => ({}))
const emptyBoard = [...Array(8)].map(() => emptyRow)

const highlightedBoard = [
  [...emptyRow],
  [{}, {}, { name: 'P', color: 'b', selected: true }, {}, {}, {}, {}, {}],
  [{}, {}, { move: true }, {}, {}, {}, {}, {}],
  [{}, {}, { move: true }, {}, {}, {}, {}, {}],
  ...emptyBoard.slice(4, 8),
]

const completeBoard = [
  [
    { name: 'R', color: 'b' },
    { name: 'N', color: 'b' },
    { name: 'B', color: 'b' },
    { name: 'Q', color: 'b' },
    { name: 'K', color: 'b' },
    { name: 'B', color: 'b' },
    { name: 'N', color: 'b' },
    { name: 'R', color: 'b' },
  ],
  [...Array(8)].map(() => ({ name: 'P', color: 'b' })),
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
  [{}, {}, { name: 'P', color: 'b' }, {}, {}, {}, {}, {}],
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
      [{}, {}, { name: 'P', color: 'b' }, {}, { name: 'P', color: 'b' }, {}, {}, {}],
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

const highlightRookMoves = ({ color, name }) => [
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [
    ...[...Array(3)].map(() => ({ move: true })),
    { name, color, selected: true },
    ...[...Array(4)].map(() => ({ move: true })),
  ],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
  [{}, {}, {}, { move: true }, {}, {}, {}, {}],
]

const highlightKnightMoves = ({ color, name }) => [
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, { move: true }, {}, { move: true }, {}, {}, {}],
  [{}, { move: true }, {}, {}, {}, { move: true }, {}, {}],
  [{}, {}, {}, { name, color, selected: true }, {}, {}, {}, {}],
  [{}, { move: true }, {}, {}, {}, { move: true }, {}, {}],
  [{}, {}, { move: true }, {}, { move: true }, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
]

const highlightBishopMoves = ({ color, name }) => [
  [{}, {}, {}, {}, {}, {}, {}, { move: true }],
  [{ move: true }, {}, {}, {}, {}, {}, { move: true }, {}],
  [{}, { move: true }, {}, {}, {}, { move: true }, {}, {}],
  [{}, {}, { move: true }, {}, { move: true }, {}, {}, {}],
  [{}, {}, {}, { name, color, selected: true }, {}, {}, {}, {}],
  [{}, {}, { move: true }, {}, { move: true }, {}, {}, {}],
  [{}, { move: true }, {}, {}, {}, { move: true }, {}, {}],
  [{ move: true }, {}, {}, {}, {}, {}, { move: true }, {}],
]

const highlightKingMoves = ({ color, name }) => [
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, { move: true }, { move: true }, { move: true }, {}, {}, {}],
  [{}, {}, { move: true }, { name, color, selected: true }, { move: true }, {}, {}, {}],
  [{}, {}, { move: true }, { move: true }, { move: true }, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}],
]

const highlightQueenMoves = ({ color, name }) => [
  [{}, {}, {}, { move: true }, {}, {}, {}, { move: true }],
  [{ move: true }, {}, {}, { move: true }, {}, {}, { move: true }, {}],
  [{}, { move: true }, {}, { move: true }, {}, { move: true }, {}, {}],
  [{}, {}, { move: true }, { move: true }, { move: true }, {}, {}, {}],
  [
    { move: true },
    { move: true },
    { move: true },
    { name, color, selected: true },
    { move: true },
    { move: true },
    { move: true },
    { move: true },
  ],
  [{}, {}, { move: true }, { move: true }, { move: true }, {}, {}, {}],
  [{}, { move: true }, {}, { move: true }, {}, { move: true }, {}, {}],
  [{ move: true }, {}, {}, { move: true }, {}, {}, { move: true }, {}],
]

test.each`
  name   | FEN    | color  | colorName  | pieceName   | expectedBoard
  ${'R'} | ${'R'} | ${'w'} | ${'white'} | ${'Rook'}   | ${highlightRookMoves}
  ${'R'} | ${'r'} | ${'b'} | ${'black'} | ${'Rook'}   | ${highlightRookMoves}
  ${'N'} | ${'N'} | ${'w'} | ${'white'} | ${'Knight'} | ${highlightKnightMoves}
  ${'N'} | ${'n'} | ${'b'} | ${'black'} | ${'Knight'} | ${highlightKnightMoves}
  ${'B'} | ${'B'} | ${'w'} | ${'white'} | ${'Bishop'} | ${highlightBishopMoves}
  ${'B'} | ${'b'} | ${'b'} | ${'black'} | ${'Bishop'} | ${highlightBishopMoves}
  ${'K'} | ${'K'} | ${'w'} | ${'white'} | ${'King'}   | ${highlightKingMoves}
  ${'K'} | ${'k'} | ${'b'} | ${'black'} | ${'King'}   | ${highlightKingMoves}
  ${'Q'} | ${'Q'} | ${'w'} | ${'white'} | ${'Queen'}  | ${highlightQueenMoves}
  ${'Q'} | ${'q'} | ${'b'} | ${'black'} | ${'Queen'}  | ${highlightQueenMoves}
`(
  'it should highlight all the moves of a $colorName $pieceName',
  ({ name, FEN, color, expectedBoard }) => {
    const { select } = game({ FEN: `8/8/8/8/3${FEN}4/8/8/8 ${color} KQkq - 0 1` })
    const { board } = select(`${name}d5`)

    expect(board).toEqual(expectedBoard({ name, color }))
  }
)

test('it should highlight the legal moves of a black pawn for its first move', () => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
  const { select } = game({ FEN: initialFEN })
  const { board } = select('a2')

  expect(board).toEqual([
    [...completeBoard[0]],
    [{ name: 'P', color: 'b', selected: true }, ...completeBoard[1].slice(1)],
    [{ move: true }, ...emptyRow.slice(1)],
    [{ move: true }, ...emptyRow.slice(1)],
    [...emptyRow],
    [...emptyRow],
    ...completeBoard.slice(6),
  ])
})

test('it should remove the hihlight squares from the board', () => {
  const initialFEN = '8/2p5/8/8/8/8/8/8 b KQkq - 0 1'
  const { select, deselect } = game({ FEN: initialFEN })
  const { board } = select('c2')
  expect(board).toEqual(highlightedBoard)
  const info = deselect()
  expect(info.board).toEqual(boardWithBlackPawn)
})

test('it should move white pawn c7 to c5', () => {
  const { move } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  const { board, FEN } = move('c5')

  expect(board).toEqual([
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
  ])
  expect(FEN).toEqual('rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1')
})
