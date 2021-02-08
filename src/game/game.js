import { PIECES as defaultPieces } from './constants'
import { createHelpers } from './helpers'
import { compose } from './utils'

export const game = ({
  FEN: initialFEN,
  board: initialBoard,
  capturedPieces: initialCapturedPieces,
  PIECES = defaultPieces,
}) => {
  const {
    addPieceToBoard,
    buildBoardFromFEN,
    buildFENPiecePlacementFromBoard,
    highligthMovesToBoard,
    cleanBoard,
    removePieceFromBoard,
    calculateMoves,
  } = createHelpers({ PIECES })

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  let FEN = initialFEN
  let board = initialBoard || buildBoardFromFEN(initialFEN)
  const turn = FEN.split(' ')[1]

  const capturedPieces = initialCapturedPieces || []

  const updateFEN = (newFEN) => (FEN = newFEN)
  const updateBoard = (newBoard) => (board = newBoard)
  const updatePiecePlacement = (piecePlacement) => {
    updateFEN(`${piecePlacement} ${FEN.split(' ').slice(1).join(' ')}`)
  }

  const getInfo = () => ({
    FEN,
    board,
    capturedPieces,
  })

  const FromSAN = (notation) => {
    const [file, rank] = notation
    return { y: ranks.indexOf(rank), x: files.indexOf(file) }
  }

  const deselect = () => {
    updateBoard(cleanBoard(board))
  }

  const select = ({ y, x }) => {
    const { name, color } = board[y][x]

    updateBoard(
      highligthMovesToBoard({ board: cleanBoard(board), y, x })(
        PIECES[name].moves({ board, color, y, x })
      )
    )
  }

  const move = ({ y, x }) => {
    const moves = calculateMoves({ board, turn, y, x })
    if (moves.length === 1) {
      const square = { ...board[moves[0].origin.y][moves[0].origin.x] }
      updateBoard(
        addPieceToBoard({
          board: removePieceFromBoard({ board: cleanBoard(board), ...moves[0].origin }),
          ...square,
          x,
          y,
        })
      )
      updatePiecePlacement(buildFENPiecePlacementFromBoard(board))
    }
  }

  return {
    getInfo,
    select: compose(FromSAN, select, getInfo),
    deselect: compose(deselect, getInfo),
    move: compose(FromSAN, move, getInfo),
  }
}
