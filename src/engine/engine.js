const defaultArgs = {
  fen: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
}

const colors = ['w', 'b']
const pieces = {
  b: ['p', 'n', 'b', 'r', 'q', 'k'],
  w: ['P', 'N', 'B', 'R', 'Q', 'K'],
}
const getAvailableRows = (board) => {
  const sumIfPiece = (total, cell) => (total + isNaN(cell) ? 1 : 0)
  const isRowNotFull = ({ row }) => row.reduce(sumIfPiece, 0) < 8
  const mapRowWithIndex = (row, rowIndex) => ({ rowIndex, row })

  return board.map(mapRowWithIndex).filter(isRowNotFull)
}

const getRandomRow = (rows) => rows[Math.floor(Math.random() * rows.length)]
const getRandomCell = (cells) => cells[Math.floor(Math.random() * cells.length)]

const getFreeCells = ({ rowIndex, row }) => {
  const isCellEmpty = ({ cell }) => !isNaN(cell)
  const mapCellWithIndex = (cell, cellIndex) => ({ rowIndex, cellIndex, cell })
  return row.map(mapCellWithIndex).filter(isCellEmpty)
}

export const engine = (args = defaultArgs) => {
  let { fen } = args
  const updateFEN = (newFEN) => (fen = newFEN)

  const buildBoardFromFEN = () => {
    const [piecePlacement] = fen.split(' ')
    const addEmptyCells = (num) => [...Array(Number(num))].map(() => 0)
    const buildCell = (row, cell) =>
      isNaN(cell) ? [...row, cell] : [...row, ...addEmptyCells(cell)]
    const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

    return piecePlacement.split('/').map(buildRow)
  }

  const buildFENFromBoard = (board) => {
    const [_, ...rest] = fen.split(' ')
    const buildRowPlacement = (row) =>
      row.reduce((str, cell) => {
        if (isNaN(cell)) return `${str}${cell}`
        const lastInfo = str[str.length - 1]
        if (isNaN(lastInfo)) return `${str}1`
        return `${str}${lastInfo + 1}`
      }, '')
    return board.reduce((placement, row) => `${placement}/${buildRowPlacement(row)}`, '')
  }

  const addPieceToBoard = ({ board, piece, rowIndex, cellIndex }) => [
    ...board.slice(0, rowIndex),
    [...board[rowIndex].slice(0, cellIndex), piece, ...board[rowIndex].slice(cellIndex + 1)],
    ...board.slice(rowIndex + 1),
  ]

  let board = buildBoardFromFEN()
  const updateBoard = (newBoard) => (board = newBoard)

  const getInfo = () => {
    return {
      activeColor: fen.split(' ')[1],
      board,
      fen,
    }
  }

  const createRandomPawn = (color = colors[0]) => {
    const piece = pieces[color][0]
    const { rowIndex, cellIndex } = getRandomCell(
      getFreeCells(getRandomRow(getAvailableRows(board)))
    )
    updateBoard(addPieceToBoard({ piece, board, rowIndex, cellIndex }))
    updateFEN(buildFENFromBoard(board))
    return getInfo()
  }

  return { getInfo, createRandomPawn }
}
