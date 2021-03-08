import { identity, ifElse, isTruthy, pipe } from '../../utils'
const byName = (name) => (origin) => (name ? origin.name === name : true)
const byFile = (x) => (origin) => (x ? origin.x === x : true)
const byRank = (y) => (origin) => (y ? origin.y === y : true)
const byCastling = ({ name, x, y }) => (origin) =>
  origin.castling && name === origin.name && y === origin.y && x === origin.x
const byEnPassant = ({ name, x, y }) => (origin) =>
  origin.enPassant && name === origin.name && y === origin.y && x === origin.x
const byPromotion = (promotion) => (origin) => origin.promotion && promotion === origin.promotion

export const filterByName = (name) => (origins) => origins.filter(byName(name))
export const filterByFile = (x) => (origins) => origins.filter(byFile(x))
export const filterByRank = (y) => (origins) => origins.filter(byRank(y))
export const findByCastling = (piece) => (origins) => origins.find(byCastling(piece))
export const findByEnPassant = (piece) => (origins) => origins.find(byEnPassant(piece))
export const filterByPromotion = (promotion) => (origins) => origins.filter(byPromotion(promotion))
export { generateLegalMoves } from './generate-legal-moves'
export { getPieceMoves } from './get-piece-moves'

export const getOrigins = (files, ranks, legalMoves) => ({
  name,
  originY,
  originX,
  y,
  x,
  promotion,
}) =>
  pipe(
    filterByName(name),
    filterByFile(originX),
    filterByRank(originY),
    ifElse(() => isTruthy(promotion), filterByPromotion(promotion), identity)
  )(legalMoves[`${files[x]}${ranks[y]}`])
