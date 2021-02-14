const filterByName = (name) => (origin) => (name ? origin.name === name : true)
const filterByFile = (x) => (origin) => (x ? origin.x === x : true)
const filterByRank = (y) => (origin) => (y ? origin.y === y : true)

export const getLegalMoves = ({ PIECES, files, ranks }) => {
  return (board, turn) => {
    const moves = {}
    ranks.forEach((rank) => {
      files.forEach((file) => {
        moves[`${file}${rank}`] = []
      })
    })
    board
      .reduce(
        (pieces, row, y) => [
          ...pieces,
          ...row
            .map((square, x) => ({ ...square, x, y }))
            .map(({ name, color, x, y }) =>
              name && color === turn ? PIECES.get(name, turn).moves({ board, color, y, x }) : []
            ),
        ],
        []
      )
      .reduce((allMoves, moves) => [...allMoves, ...moves], [])
      .forEach(({ y, x, origin }) => moves[`${files[x]}${ranks[y]}`].push(origin))

    return {
      getMoves: ({ name, originY, originX, y, x }) =>
        moves[`${files[x]}${ranks[y]}`]
          .filter(filterByName(name))
          .filter(filterByFile(originX))
          .filter(filterByRank(originY)),
      getSAN: (piece, { rank, file }) => {
        if (moves[`${file}${rank}`].length === 1) return `${piece.name}${file}${rank}`
        const byName = moves[`${file}${rank}`].filter(filterByName(piece.name))
        if (byName.length === 1) return `${piece.name}${file}${rank}`
        const byFile = byName.filter(filterByFile(piece.x))
        if (byFile.length === 1) return `${piece.name}${files[byFile[0].x]}${file}${rank}`
        const byRank = byFile.filter(filterByRank(piece.y))
        if (byRank.length === 1)
          return `${piece.name}${files[byRank[0].x]}${ranks[byRank[0].y]}${file}${rank}`
      },
    }
  }
}
