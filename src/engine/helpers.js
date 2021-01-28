import { PIECES, FENPieces } from './constants'

export const getAvailableRows = (board, piece) => {
  const isPawn = piece === PIECES[piece].name
  const isLegal = ({ rowIndex }) => (isPawn && rowIndex > 0 && rowIndex < 7) || !isPawn

  const sumIfPiece = (total, { piece }) => total + (piece ? 1 : 0)
  const isRowNotFull = ({ row }) => row.reduce(sumIfPiece, 0) < 8
  const mapRowWithIndex = (row, rowIndex) => ({ rowIndex, row })

  return board.map(mapRowWithIndex).filter(isLegal).filter(isRowNotFull)
}

export const getRandomRow = (rows) => rows[Math.floor(Math.random() * rows.length)]
export const getRandomCell = (cells) => cells[Math.floor(Math.random() * cells.length)]

export const getFreeCells = ({ rowIndex, row }) => {
  const isCellEmpty = ({ cell: { piece } }) => !piece
  const mapCellWithIndex = (cell, cellIndex) => ({ rowIndex, cellIndex, cell })
  return row.map(mapCellWithIndex).filter(isCellEmpty)
}

export const buildBoardFromFEN = (piecePlacement) => {
  const convertFromFEN = (piece) => {
    const color = FENPieces['w'].indexOf(piece) !== -1 ? 'w' : 'b'
    return { piece, color }
  }
  const addEmptyCells = (num) =>
    [...Array(Number(num))].map(() => ({
      piece: false,
    }))
  const buildCell = (row, cell) =>
    isNaN(cell) ? [...row, convertFromFEN(cell)] : [...row, ...addEmptyCells(cell)]
  const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

  return piecePlacement.split('/').map(buildRow)
}

export const buildFENPiecePlacementFromBoard = (board) => {
  const buildRowPlacement = (row) =>
    row.reduce((str, { piece }) => {
      if (piece) return `${str}${piece}`
      const lastInfo = str[str.length - 1]
      if (isNaN(lastInfo)) return `${str}1`
      return `${str}${lastInfo + 1}`
    }, '')
  return board.reduce((placement, row) => `${placement}/${buildRowPlacement(row)}`, '')
}

export const addPieceToBoard = ({ board, piece, color, rowIndex, cellIndex }) => [
  ...board.slice(0, rowIndex),
  [
    ...board[rowIndex].slice(0, cellIndex),
    { piece, color },
    ...board[rowIndex].slice(cellIndex + 1),
  ],
  ...board.slice(rowIndex + 1),
]

export const cleanBoard = (board) =>
  board.map((row) =>
    row.map(({ piece, color }) => {
      const props = {}
      if (color) props.color = color
      return { piece, ...props }
    })
  )

export const highlithPieceCell = (board, { y, x }) =>
  board.map((row, i) =>
    row.map((cell, j) => (i === y && j === x ? { ...cell, highlight: true } : { ...cell }))
  )
export const highlithMovesToBoard = (board) => (moves) => {
  moves.forEach(({ y, x }) => {
    board[y][x].highlight = true
  })
  return board
}

export const isValidPiece = (piece) => !!PIECES[piece]
