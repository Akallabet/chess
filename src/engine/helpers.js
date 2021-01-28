import { COLORS, PIECES, FENPieces } from './constants'

export const getAvailableRows = (board, piece) => {
  const isPawn = piece === PIECES[0]
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

export const isValidPiece = (piece) => PIECES.indexOf(piece) !== -1
