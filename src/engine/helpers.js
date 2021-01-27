import { COLORS, PIECES } from './constants'

export const getAvailableRows = (board) => {
  const sumIfPiece = (total, cell) => total + (isNaN(cell) ? 1 : 0)
  const isRowNotFull = ({ row }) => row.reduce(sumIfPiece, 0) < 8
  const mapRowWithIndex = (row, rowIndex) => ({ rowIndex, row })

  return board.map(mapRowWithIndex).filter(isRowNotFull)
}

export const getRandomRow = (rows) => rows[Math.floor(Math.random() * rows.length)]
export const getRandomCell = (cells) => cells[Math.floor(Math.random() * cells.length)]

export const getFreeCells = ({ rowIndex, row }) => {
  const isCellEmpty = ({ cell }) => !isNaN(cell)
  const mapCellWithIndex = (cell, cellIndex) => ({ rowIndex, cellIndex, cell })
  return row.map(mapCellWithIndex).filter(isCellEmpty)
}

export const buildBoardFromFEN = (piecePlacement) => {
  const addEmptyCells = (num) => [...Array(Number(num))].map(() => 0)
  const buildCell = (row, cell) => (isNaN(cell) ? [...row, cell] : [...row, ...addEmptyCells(cell)])
  const buildRow = (rowPlacement) => rowPlacement.split('').reduce(buildCell, [])

  return piecePlacement.split('/').map(buildRow)
}

export const buildFENPiecePlacementFromBoard = (board) => {
  const buildRowPlacement = (row) =>
    row.reduce((str, cell) => {
      if (isNaN(cell)) return `${str}${cell}`
      const lastInfo = str[str.length - 1]
      if (isNaN(lastInfo)) return `${str}1`
      return `${str}${lastInfo + 1}`
    }, '')
  return board.reduce((placement, row) => `${placement}/${buildRowPlacement(row)}`, '')
}

export const addPieceToBoard = ({ board, piece, rowIndex, cellIndex }) => [
  ...board.slice(0, rowIndex),
  [...board[rowIndex].slice(0, cellIndex), piece, ...board[rowIndex].slice(cellIndex + 1)],
  ...board.slice(rowIndex + 1),
]

export const isValidPiece = (piece) =>
  PIECES[COLORS[0]].indexOf(piece) !== -1 || PIECES[COLORS[1]].indexOf(piece) !== -1
