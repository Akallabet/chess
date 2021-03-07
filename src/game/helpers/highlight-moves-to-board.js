export const highligthMovesToBoard = (board) => (moves) =>
  board.map((row, y) =>
    row
      .map(({ meta = {}, ...square }, x) => {
        return moves.find((move) => move.y === y && move.x === x)
          ? { ...square, meta: { ...meta, move: true } }
          : { ...square, meta }
      })
      .map(({ meta = {}, ...square }, x) => {
        return moves.find((move) => move.y === y && move.x === x && move.check)
          ? { ...square, meta: { ...meta, check: true } }
          : { ...square, meta }
      })
  )
