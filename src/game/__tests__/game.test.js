import { game } from '../game'

const emptyRow = [...Array(8)].map(() => ({ piece: false }))
const emptyBoard = [...Array(8)].map(() => emptyRow)

const highlightedBoard = [
  [...emptyRow],
  [
    { piece: false },
    { piece: false },
    { piece: 'p', color: 'b', highlight: true },
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
]

const boardWithBlackPawn = [
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
]
test('it should return an empty board', () => {
  const { getInfo } = game({ FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: emptyBoard,
    FEN: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
    activePiece: false,
    capturedPieces: [],
  })
})

test('it should return a board with a black pawn in second row, third column', () => {
  const { getInfo } = game({ FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
    board: boardWithBlackPawn,
    FEN: '8/2p5/8/8/8/8/8/8 w KQkq - 0 1',
    activePiece: false,
    capturedPieces: [],
  })
})

test('it should return a board with two black pawn in second row', () => {
  const { getInfo } = game({ FEN: '8/2p1p3/8/8/8/8/8/8 w KQkq - 0 1' })
  expect(getInfo()).toEqual({
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
    activePiece: false,
    capturedPieces: [],
  })
})

test('it should highlight the legal moves of a piece', () => {
  const initialFEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'
  const { selectPiece } = game({ FEN: initialFEN })
  const { board, activePiece } = selectPiece({ y: 1, x: 2 })
  expect(board).toEqual(highlightedBoard)
  expect(activePiece).toEqual({ y: 1, x: 2, piece: 'p', color: 'b' })
})

test('it should deselect the legal moves of a piece', () => {
  const initialFEN = '8/2p5/8/8/8/8/8/8 w KQkq - 0 1'
  const { selectPiece, deselectPiece } = game({ FEN: initialFEN })
  const { board, activePiece } = selectPiece({ y: 1, x: 2 })
  expect(board).toEqual(highlightedBoard)
  expect(activePiece).toEqual({ y: 1, x: 2, piece: 'p', color: 'b' })
  const info = deselectPiece({ y: 1, x: 2 })
  expect(info.board).toEqual(boardWithBlackPawn)
  expect(info.activePiece).toEqual(false)
})

test('it should move a pawn', () => {
  const initialFEN = '8/8/8/8/8/8/3P4/8 w KQkq - 0 1'
  const { selectPiece, moveActivePiece } = game({ FEN: initialFEN })
  selectPiece({ y: 6, x: 3 })
  const { FEN } = moveActivePiece({ y: 5, x: 3 })
  expect(FEN).toEqual('8/8/8/8/8/3P4/8/8 w KQkq - 0 1')
})
