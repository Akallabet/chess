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

    return moves
  }
}
