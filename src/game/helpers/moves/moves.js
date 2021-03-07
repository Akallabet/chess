const isWithinBoard = (board, { y, x }) => board[y] && board[y][x]
const isValidStep = (board) => ({ y, x, ...args }) => !board[y][x].name && { y, x, ...args }
const isValidCapture = (board, color) => ({ y, x, ...args }) =>
  board[y][x].name && board[y][x].color !== color && { y, x, capture: true, ...args }
const isValidCheck = (board, color, NAMES) => ({ y, x, ...args }) =>
  isWithinBoard(board, { y, x }) &&
  board[y][x].name === NAMES.K &&
  board[y][x].color !== color && { y, x, check: true, ...args }
const isValidMove = (board, color) => ({ y, x }) =>
  isValidStep(board)({ y, x }) || isValidCapture(board, color)({ y, x })

const validate = (board, { y, x }, isValid, moves) => {
  const ret = []
  for (const [increment, limit = () => true] of moves) {
    let steps = 1
    let position = increment({ y, x })
    while (isWithinBoard(board, position) && limit(steps)) {
      const piece = isValid(position)
      if (piece) ret.push(isValid(position))
      if (isValidStep(board)(position)) {
        position = increment(position)
        steps += 1
      } else {
        break
      }
    }
  }
  return ret
}

export const getMoves = (rules, NAMES, args) => {
  const {
    y,
    x,
    board,
    FEN: { activeColor },
  } = args

  const validateCheck = (moves) => (position) => {
    const hasCheck = validate(board, position, isValidCheck(board, activeColor, NAMES), moves).find(
      ({ check }) => check
    )
    return hasCheck ? { ...position, check: true } : position
  }

  const { moves = [], steps = [], captures = [] } = rules[board[y][x].name](args)

  const ret = [
    ...validate(board, { y, x }, isValidMove(board, activeColor), moves).map(validateCheck(moves)),
    ...validate(board, { y, x }, isValidStep(board), steps).map(validateCheck(steps)),
    ...validate(board, { y, x }, isValidCapture(board, activeColor), captures).map(
      validateCheck(captures)
    ),
  ]
  return ret
}
