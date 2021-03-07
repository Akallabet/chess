const byName = (name) => (origin) => (name ? origin.name === name : true)
const byFile = (x) => (origin) => (x ? origin.x === x : true)
const byRank = (y) => (origin) => (y ? origin.y === y : true)
const byCastling = ({ name, x, y }) => (origin) =>
  origin.castling && name === origin.name && y === origin.y && x === origin.x
const byEnPassant = ({ name, x, y }) => (origin) =>
  origin.enPassant && name === origin.name && y === origin.y && x === origin.x

export const filterByName = (name) => (origins) => origins.filter(byName(name))
export const filterByFile = (x) => (origins) => origins.filter(byFile(x))
export const filterByRank = (y) => (origins) => origins.filter(byRank(y))
export const findByCastling = (piece) => (origins) => origins.find(byCastling(piece))
export const findByEnPassant = (piece) => (origins) => origins.find(byEnPassant(piece))

export { generateLegalMoves } from './generate-legal-moves'
