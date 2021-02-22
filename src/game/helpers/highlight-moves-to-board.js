export const highligthMovesToBoard = ({ moves, ...origin }) => (board) =>
  board.map((row, y) =>
    row
      .map(({ meta = {}, ...square }, x) => {
        return moves.find((move) => move.y === y && move.x === x)
          ? { ...square, meta: { ...meta, move: true } }
          : { ...square, meta }
      })
      .map(({ meta = {}, ...square }, x) =>
        origin.y === y && origin.x === x
          ? { ...square, meta: { ...meta, selected: true } }
          : { ...square, meta }
      )
  )
