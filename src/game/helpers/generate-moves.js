import { check, pipe } from '../utils'

const byName = (name) => (origin) => (name ? origin.name === name : true)
const byFile = (x) => (origin) => (x ? origin.x === x : true)
const byRank = (y) => (origin) => (y ? origin.y === y : true)

const filterByName = (name) => (origins) => origins.filter(byName(name))
const filterByFile = (x) => (origins) => origins.filter(byFile(x))
const filterByRank = (y) => (origins) => origins.filter(byRank(y))

const createEmptyMoves = ({ ranks, files, ...args }) => {
  const moves = {}
  ranks.forEach((rank) => {
    files.forEach((file) => {
      moves[`${file}${rank}`] = []
    })
  })
  return { moves, ranks, files, ...args }
}

const createBoardMoves = ({ PIECES, files, ranks, board, activeColor, moves }) => {
  board
    .reduce(
      (pieces, row, y) => [
        ...pieces,
        ...row.map(({ name, color }, x) =>
          name && color === activeColor
            ? PIECES.get(name, activeColor).moves({ board, color, y, x })
            : []
        ),
      ],
      []
    )
    .reduce((allMoves, moves) => [...allMoves, ...moves], [])
    .forEach(({ y, x, origin }) => moves[`${files[x]}${ranks[y]}`].push(origin))
  return { PIECES, files, ranks, board, activeColor, moves }
}

const isUnambiguous = (origins) => origins.length === 1
const buildSAN = (destination) => (origin) => `${origin}${destination}`

const buildGetters = ({ files, ranks, moves }) => ({
  getMoves: ({ name, originY, originX, y, x }) =>
    pipe(
      filterByName(name),
      filterByFile(originX),
      filterByRank(originY)
    )(moves[`${files[x]}${ranks[y]}`]),
  getSAN: (piece, { rank, file }) => {
    const buildOrigin = buildSAN(`${file}${rank}`)
    const buildOriginName = ([{ name }]) => buildOrigin(`${name}`)
    const buildOriginNameAndFile = ([{ name, x }]) => buildOrigin(`${name}${files[x]}`)
    const buildOriginNameFileAndRank = ([{ name, y, x }]) =>
      buildOrigin(`${name}${files[x]}${ranks[y]}`)

    return pipe(
      check(
        isUnambiguous,
        buildOriginName,
        pipe(
          filterByName(piece.name),
          check(
            isUnambiguous,
            buildOriginName,
            pipe(
              filterByFile(piece.x),
              check(
                isUnambiguous,
                buildOriginNameAndFile,
                pipe(filterByRank(piece.y), check(isUnambiguous, buildOriginNameFileAndRank))
              )
            )
          )
        )
      )
    )(moves[`${file}${rank}`])
  },
})

export const generateMoves = pipe(createEmptyMoves, createBoardMoves, buildGetters)
