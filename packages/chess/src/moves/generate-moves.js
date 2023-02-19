import * as R from 'ramda';
import { flags } from '../constants.js';
import { areOpponents, overProp, rotate } from '../utils/index.js';

const generateMovesFromPattern = (
  [pattern, limit, flag],
  count,
  moves = [],
  originCoord,
  state
) => {
  const lastMove = R.last(moves) || { coord: originCoord };
  const currentCoord = pattern(lastMove.coord, state);
  const { board } = state;
  const row = board[currentCoord.y];
  if (!row) return moves;
  const cell = board[currentCoord.y][currentCoord.x];
  if (!cell) return moves;
  if (limit(count, currentCoord, originCoord, state)) return moves;
  if (
    cell.piece &&
    !areOpponents(cell.piece, board[originCoord.y][originCoord.x].piece)
  )
    return moves;
  if (
    cell.piece &&
    areOpponents(cell.piece, board[originCoord.y][originCoord.x].piece)
  ) {
    moves.push({
      coord: currentCoord,
      flag: { [flag || flags.capture]: true },
    });
    return moves;
  }
  if (!cell.piece)
    moves.push({ coord: currentCoord, flag: { [flag || flags.move]: true } });
  return generateMovesFromPattern(
    [pattern, limit, flag],
    count + 1,
    moves,
    originCoord,
    state
  );
};

const generateMovesFromPatterns = R.curryN(
  3,
  (patterns = [], originCoord = { x: 0, y: 0 }, state, moves = []) => {
    if (patterns.length === 0) return moves;
    return generateMovesFromPatterns(
      R.slice(1, Infinity, patterns),
      originCoord,
      state,
      R.concat(
        moves,
        generateMovesFromPattern(R.head(patterns), 0, [], originCoord, state)
      )
    );
  }
);

const generateKnightMoves = generateMovesFromPatterns([
  [({ x, y }) => ({ x: x + 2, y: y + 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x + 1, y: y + 2 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 1, y: y + 2 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 2, y: y + 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 2, y: y - 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 1, y: y - 2 }), R.lte(1)],
  [({ x, y }) => ({ x: x + 1, y: y - 2 }), R.lte(1)],
  [({ x, y }) => ({ x: x + 2, y: y - 1 }), R.lte(1)],
]);

const generateBishopMoves = generateMovesFromPatterns([
  [({ x, y }) => ({ x: x + 1, y: y + 1 }), R.F],
  [({ x, y }) => ({ x: x - 1, y: y + 1 }), R.F],
  [({ x, y }) => ({ x: x - 1, y: y - 1 }), R.F],
  [({ x, y }) => ({ x: x + 1, y: y - 1 }), R.F],
]);
const generateRookMoves = generateMovesFromPatterns([
  [({ x, y }) => ({ x: x + 1, y }), R.F],
  [({ x, y }) => ({ x: x - 1, y }), R.F],
  [({ x, y }) => ({ x, y: y - 1 }), R.F],
  [({ x, y }) => ({ x, y: y + 1 }), R.F],
]);
const generateQueenMoves = generateMovesFromPatterns([
  [({ x, y }) => ({ x: x + 1, y }), R.F],
  [({ x, y }) => ({ x: x - 1, y }), R.F],
  [({ x, y }) => ({ x, y: y - 1 }), R.F],
  [({ x, y }) => ({ x, y: y + 1 }), R.F],
  [({ x, y }) => ({ x: x + 1, y: y + 1 }), R.F],
  [({ x, y }) => ({ x: x - 1, y: y + 1 }), R.F],
  [({ x, y }) => ({ x: x - 1, y: y - 1 }), R.F],
  [({ x, y }) => ({ x: x + 1, y: y - 1 }), R.F],
]);
const generateKingMoves = generateMovesFromPatterns([
  [({ x, y }) => ({ x: x + 1, y }), R.lte(1)],
  [({ x, y }) => ({ x: x - 1, y }), R.lte(1)],
  [({ x, y }) => ({ x, y: y - 1 }), R.lte(1)],
  [({ x, y }) => ({ x, y: y + 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x + 1, y: y + 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 1, y: y + 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x - 1, y: y - 1 }), R.lte(1)],
  [({ x, y }) => ({ x: x + 1, y: y - 1 }), R.lte(1)],
]);

const stopIfOpponent = (_, { x, y }, start, { board }) => {
  if (
    board[y][x].piece &&
    areOpponents(board[y][x].piece, board[start.y][start.x].piece)
  )
    return false;
  return true;
};

const generatePawnMoves = generateMovesFromPatterns([
  [
    ({ x, y }) => ({ x, y: y + 1 }),
    (count, _, start) => {
      if (start.y > 1 && count >= 1) return true;
      if (start.y === 1 && count >= 2) return true;
    },
  ],
  [({ x, y }) => ({ x: x + 1, y: y + 1 }), stopIfOpponent, flags.capture],
  [({ x, y }) => ({ x: x - 1, y: y + 1 }), stopIfOpponent, flags.capture],
]);

const withRotatedBoard = generateMovesFn => (coord, state) =>
  R.pipe(
    rotate,
    board =>
      generateMovesFn(
        { x: 7 - coord.x, y: 7 - coord.y },
        R.assoc('board', board, state)
      ),
    R.map(overProp('coord', ({ y, x }) => ({ y: 7 - y, x: 7 - x })))
  )(state.board);

export const generateMoves = (coord, state, rejectFn = R.F) => {
  const generateMovesMap = {
    p: generatePawnMoves,
    P: withRotatedBoard(generatePawnMoves),
    n: generateKnightMoves,
    N: generateKnightMoves,
    b: generateBishopMoves,
    B: generateBishopMoves,
    r: generateRookMoves,
    R: generateRookMoves,
    q: generateQueenMoves,
    Q: withRotatedBoard(generateQueenMoves),
    k: generateKingMoves,
    K: withRotatedBoard(generateKingMoves),
  };

  const piece = R.path([coord.y, coord.x, 'piece'], state.board);
  const generateMovesFn = R.prop(piece, generateMovesMap);

  return R.pipe(
    generateMovesFn,
    R.reject(rejectFn(coord, state)),
    R.prepend({ coord, flag: { [flags.selected]: true } })
  )(coord, state);
};
