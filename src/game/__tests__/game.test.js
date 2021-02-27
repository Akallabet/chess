import { game } from '../game'

const empty = { meta: {} }
const emptyRow = [...Array(8)].map(() => empty)
const emptyBoard = [...Array(8)].map(() => emptyRow)

const completeBoard = [
  [
    { name: 'R', color: 'b', meta: {} },
    { name: 'N', color: 'b', meta: {} },
    { name: 'B', color: 'b', meta: {} },
    { name: 'Q', color: 'b', meta: {} },
    { name: 'K', color: 'b', meta: {} },
    { name: 'B', color: 'b', meta: {} },
    { name: 'N', color: 'b', meta: {} },
    { name: 'R', color: 'b', meta: {} },
  ],
  [...Array(8)].map(() => ({ name: 'P', color: 'b', meta: {} })),
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [...emptyRow],
  [...Array(8)].map(() => ({ name: 'P', color: 'w', meta: {} })),
  [
    { name: 'R', color: 'w', meta: {} },
    { name: 'N', color: 'w', meta: {} },
    { name: 'B', color: 'w', meta: {} },
    { name: 'Q', color: 'w', meta: {} },
    { name: 'K', color: 'w', meta: {} },
    { name: 'B', color: 'w', meta: {} },
    { name: 'N', color: 'w', meta: {} },
    { name: 'R', color: 'w', meta: {} },
  ],
]

const boardWithBlackPawn = [
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, { name: 'P', color: 'b', meta: {} }, empty, empty, empty, empty, empty],
  ...emptyBoard.slice(2, 8),
]
test('it should return an empty board', () => {
  const { getInfo } = game({ FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toMatchObject({
    board: emptyBoard,
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  const { getInfo } = game({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toMatchObject({
    board: boardWithBlackPawn,
    FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = game({ FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toMatchObject({
    board: [
      [empty, empty, empty, empty, empty, empty, empty, empty],
      [
        empty,
        empty,
        { name: 'P', color: 'b', meta: {} },
        empty,
        { name: 'P', color: 'b', meta: {} },
        empty,
        empty,
        empty,
      ],
      ...emptyBoard.slice(2, 8),
    ],
    FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1',
    capturedPieces: [],
  })
})

test('it should return a board with all the standard pieces', () => {
  const { getInfo } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  const { board, FEN } = getInfo()

  expect(board).toEqual(completeBoard)
  expect(FEN).toEqual('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
})

const highlightRookMoves = ({ color, name }) => [
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [
    ...[...Array(3)].map(() => ({ meta: { move: true } })),
    { name, color, meta: {} },
    ...[...Array(4)].map(() => ({ meta: { move: true } })),
  ],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, empty],
]

const highlightKnightMoves = ({ color, name }) => [
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, { meta: { move: true } }, empty, { meta: { move: true } }, empty, empty, empty],
  [empty, { meta: { move: true } }, empty, empty, empty, { meta: { move: true } }, empty, empty],
  [empty, empty, empty, { name, color, meta: {} }, empty, empty, empty, empty],
  [empty, { meta: { move: true } }, empty, empty, empty, { meta: { move: true } }, empty, empty],
  [empty, empty, { meta: { move: true } }, empty, { meta: { move: true } }, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
]

const highlightBishopMoves = ({ color, name }) => [
  [empty, empty, empty, empty, empty, empty, empty, { meta: { move: true } }],
  [{ meta: { move: true } }, empty, empty, empty, empty, empty, { meta: { move: true } }, empty],
  [empty, { meta: { move: true } }, empty, empty, empty, { meta: { move: true } }, empty, empty],
  [empty, empty, { meta: { move: true } }, empty, { meta: { move: true } }, empty, empty, empty],
  [empty, empty, empty, { name, color, meta: {} }, empty, empty, empty, empty],
  [empty, empty, { meta: { move: true } }, empty, { meta: { move: true } }, empty, empty, empty],
  [empty, { meta: { move: true } }, empty, empty, empty, { meta: { move: true } }, empty, empty],
  [{ meta: { move: true } }, empty, empty, empty, empty, empty, { meta: { move: true } }, empty],
]

const highlightKingMoves = ({ color, name }) => [
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [
    empty,
    empty,
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    empty,
    empty,
    empty,
  ],
  [
    empty,
    empty,
    { meta: { move: true } },
    { name, color, meta: {} },
    { meta: { move: true } },
    empty,
    empty,
    empty,
  ],
  [
    empty,
    empty,
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    empty,
    empty,
    empty,
  ],
  [empty, empty, empty, empty, empty, empty, empty, empty],
  [empty, empty, empty, empty, empty, empty, empty, empty],
]

const highlightQueenMoves = ({ color, name }) => [
  [empty, empty, empty, { meta: { move: true } }, empty, empty, empty, { meta: { move: true } }],
  [
    { meta: { move: true } },
    empty,
    empty,
    { meta: { move: true } },
    empty,
    empty,
    { meta: { move: true } },
    empty,
  ],
  [
    empty,
    { meta: { move: true } },
    empty,
    { meta: { move: true } },
    empty,
    { meta: { move: true } },
    empty,
    empty,
  ],
  [
    empty,
    empty,
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    empty,
    empty,
    empty,
  ],
  [
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    { name, color, meta: {} },
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
  ],
  [
    empty,
    empty,
    { meta: { move: true } },
    { meta: { move: true } },
    { meta: { move: true } },
    empty,
    empty,
    empty,
  ],
  [
    empty,
    { meta: { move: true } },
    empty,
    { meta: { move: true } },
    empty,
    { meta: { move: true } },
    empty,
    empty,
  ],
  [
    { meta: { move: true } },
    empty,
    empty,
    { meta: { move: true } },
    empty,
    empty,
    { meta: { move: true } },
    empty,
  ],
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
    const { moves } = game({ FEN: `8/8/8/8/3${FEN}4/8/8/8 ${color} - - 0 1` })
    const board = moves(`${name}d4`)

    expect(board).toEqual(expectedBoard({ name, color }))
  }
)

test('it should highlight the legal moves of a black pawn for its first move', () => {
  const initialFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
  const { moves } = game({ FEN: initialFEN })
  const board = moves('a7')

  expect(board).toEqual([
    [...completeBoard[0]],
    [{ name: 'P', color: 'b', meta: {} }, ...completeBoard[1].slice(1)],
    [{ meta: { move: true } }, ...emptyRow.slice(1)],
    [{ meta: { move: true } }, ...emptyRow.slice(1)],
    [...emptyRow],
    [...emptyRow],
    ...completeBoard.slice(6),
  ])
})

test('it should move white pawn c2 to c4', () => {
  const { move } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  const { board, FEN } = move('c4')

  expect(board).toEqual([
    ...completeBoard.slice(0, 4),
    [empty, empty, { name: 'P', color: 'w', meta: {} }, empty, empty, empty, empty, empty],
    [empty, empty, empty, empty, empty, empty, empty, empty],
    [
      { name: 'P', color: 'w', meta: {} },
      { name: 'P', color: 'w', meta: {} },
      empty,
      { name: 'P', color: 'w', meta: {} },
      { name: 'P', color: 'w', meta: {} },
      { name: 'P', color: 'w', meta: {} },
      { name: 'P', color: 'w', meta: {} },
      { name: 'P', color: 'w', meta: {} },
    ],
    [...completeBoard[7]],
  ])
  expect(FEN).toEqual('rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1')
})

test('it should not execute an ambiguous move', () => {
  const { move } = game({
    FEN: 'r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/2N5/PPPPNPPP/R1BQKB1R w KQkq - 0 4',
  })
  const { FEN } = move('Nc3')

  expect(FEN).toEqual('r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/2N5/PPPPNPPP/R1BQKB1R w KQkq - 0 4')
})

test('it should move a piece give its name', () => {
  const { move } = game({
    FEN: 'r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 4',
  })
  const { FEN } = move('Pc3')

  expect(FEN).toEqual('r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/2P5/PP1PNPPP/RNBQKB1R b KQkq - 0 4')
})

test('it should move a piece given its name and file', () => {
  const { move } = game({
    FEN: 'r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/8/PPPPNPPP/RNBQKB1R w KQkq - 0 4',
  })
  const { FEN } = move('Nbc3')

  expect(FEN).toEqual('r1bqkb1r/ppp1pppp/2n2n2/3p4/4P3/2N5/PPPPNPPP/R1BQKB1R b KQkq - 0 4')
})

test('it should move a piece given its name, file and rank', () => {
  const { move } = game({
    FEN: 'r1bqkb1r/ppp1pp1p/2n3p1/1N5n/2PpP3/8/PP1P1PPP/RNBQKB1R w KQkq - 0 4',
  })
  const { FEN } = move('Nb5c3')

  expect(FEN).toEqual('r1bqkb1r/ppp1pp1p/2n3p1/7n/2PpP3/2N5/PP1P1PPP/RNBQKB1R b KQkq - 0 4')
})

test("it should increment the number of moves after Black's move", () => {
  const { move } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  expect(move('c3').move('c5').fullmoveNumber).toEqual(2)
  expect(move('b3').fullmoveNumber).toEqual(2)
  expect(move('b5').fullmoveNumber).toEqual(3)
})

test('it should castle the white King on King side', () => {
  const { move } = game({ FEN: '8/8/8/8/8/8/8/R3K2R w KQkq - 0 1' })
  expect(move('0-0').FEN).toEqual('8/8/8/8/8/8/8/R4RK1 b kq - 0 1')
})

test('it should castle the white King on Queen side', () => {
  const { move } = game({ FEN: '8/8/8/8/8/8/8/R3K2R w KQkq - 0 1' })
  expect(move('0-0-0').FEN).toEqual('8/8/8/8/8/8/8/2KR3R b kq - 0 1')
})

test('it should castle the black King on King side', () => {
  const { move } = game({ FEN: 'r3k2r/8/8/8/8/8/8/8 b KQkq - 0 1' })
  expect(move('0-0').FEN).toEqual('r4rk1/8/8/8/8/8/8/8 w KQ - 0 2')
})

test('it should castle the black King on Queen side', () => {
  const { move } = game({ FEN: 'r3k2r/8/8/8/8/8/8/8 b KQkq - 0 1' })
  expect(move('0-0-0').FEN).toEqual('2kr3r/8/8/8/8/8/8/8 w KQ - 0 2')
})

test('it should disable castling availability after both colors have castled', () => {
  const { move } = game({ FEN: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1' })
  const { FEN } = move('0-0').move('0-0-0')
  expect(FEN).toEqual('2kr3r/8/8/8/8/8/8/R4RK1 w - - 0 2')
})

test.each`
  color  | side       | SAN        | availability
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'kq'}
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'Qkq'}
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'Q'}
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'k'}
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'q'}
  ${'w'} | ${'king'}  | ${'0-0'}   | ${'-'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'kq'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'Kkq'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'K'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'k'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'q'}
  ${'w'} | ${'queen'} | ${'0-0-0'} | ${'-'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'KQ'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'KQq'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'q'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'K'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'Q'}
  ${'b'} | ${'king'}  | ${'0-0'}   | ${'-'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'KQ'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'KQk'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'K'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'k'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'Q'}
  ${'b'} | ${'queen'} | ${'0-0-0'} | ${'-'}
`(
  'it should not castle $color King on $side side when castling availability is $availability',
  ({ color, SAN, availability }) => {
    const { move } = game({ FEN: `r3k2r/8/8/8/8/8/8/R3K2R ${color} ${availability} - 0 1` })
    const { FEN } = move(SAN)
    expect(FEN).toEqual(`r3k2r/8/8/8/8/8/8/R3K2R ${color} ${availability} - 0 1`)
  }
)

test('it should flag a pawn as en-passant if it moves of 2 squares at once', () => {
  const { move } = game({ FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' })
  const { FEN } = move('c4')
  expect(FEN).toEqual('rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1')
  expect(move('c6').FEN).toEqual('rnbqkbnr/pp1ppppp/2p5/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2')
})
