export const cleanBoard = (board) =>
  board.map((row) =>
    row.map(({ _meta, ...square }) => ({
      ...square,
      meta: {},
    }))
  )
