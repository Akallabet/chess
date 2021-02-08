export const cleanBoard = () => (board) =>
  board.map((row) =>
    row.map(({ name, color }) => {
      const ret = {}
      if (name) ret.name = name
      if (color) ret.color = color
      return ret
    })
  )
