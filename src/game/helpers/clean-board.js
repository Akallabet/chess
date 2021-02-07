export const cleanBoard = () => (board) =>
  board.map((row) =>
    // eslint-disable-next-line no-unused-vars
    row.map(({ highlight, ...props }) => ({ ...props }))
  )
