export const buildFENPiecePlacementFromBoard = ({ PIECES }) => {
  const buildRowPlacement = (row) =>
    row.reduce((str, { name }) => {
      if (name) return `${str}${PIECES[name].name}`
      if (isNaN(str[str.length - 1])) return `${str}1`
      return `${str.slice(0, str.length - 1)}${Number(str[str.length - 1]) + 1}`
    }, '')

  return (board) => {
    return board.reduce((placement, row) => {
      const separator = placement ? '/' : ''
      return `${placement}${separator}${buildRowPlacement(row)}`
    }, '')
  }
}
