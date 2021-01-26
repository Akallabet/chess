const defaultArgs = {
  fen: '8/8/8/8/8/8/8/8 w KQkq - 0 1',
}

const colors = ['w', 'b']
const pieces = {
  b: ['p', 'n', 'b', 'r', 'q', 'k'],
  w: ['P', 'N', 'B', 'R', 'Q', 'K'],
}

export const engine = (args = defaultArgs) => {
  const { fen } = args

  const [
    piecePlacement,
    activeColor,
    castlingAvailability,
    enPassantTarget,
    halfmoveClock,
    fullmoveNumber,
  ] = fen.split(' ')

  const board = piecePlacement.split('/').map((rowPlacement) => {
    return rowPlacement.split('').reduce((row, el) => {
      if (isNaN(el)) return [...row, el]
      return [...row, ...[...Array(Number(el))].map(() => 0)]
    }, [])
  })

  return {
    activeColor,
    board,
    fen,
  }
}
