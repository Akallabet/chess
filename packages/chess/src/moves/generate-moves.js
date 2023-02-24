import * as R from 'ramda';
import { flags } from '../constants.js';
import { getCastlingRights } from '../fen/index.js';
import {
  areOpponents,
  overProp,
  rotate,
  anyCellOccupied,
  isCellOccupied,
} from '../utils/index.js';
import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';

const generateMovesFromPattern = (
  [pattern, limit, flag],
  count,
  moves = [],
  originCoord,
  state
) => {
  const lastMove = R.last(moves) || { coord: originCoord };
  const currentCoord = pattern(lastMove.coord, state);
  const row = state.board[currentCoord.y];
  if (!row) return moves;
  const cell = state.board[currentCoord.y][currentCoord.x];
  if (!cell) return moves;
  if (limit(count, currentCoord, originCoord, state)) return moves;
  if (
    cell.piece &&
    !areOpponents(cell.piece, state.board[originCoord.y][originCoord.x].piece)
  )
    return moves;
  if (
    cell.piece &&
    areOpponents(cell.piece, state.board[originCoord.y][originCoord.x].piece)
  ) {
    return R.append(
      {
        coord: currentCoord,
        flag: { [flag || flags.capture]: true },
      },
      moves
    );
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
  4,
  (
    patterns = [],
    rejectFn,
    originCoord = { x: 0, y: 0 },
    state,
    moves = []
  ) => {
    if (patterns.length === 0)
      return R.reject(rejectFn(originCoord, state), moves);
    return generateMovesFromPatterns(
      R.slice(1, Infinity, patterns),
      rejectFn,
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

const canKingMoveHere = (count, current, _, state) =>
  count === 0 && isCellUnderCheck(state, current);
const generateKingMoves = generateMovesFromPatterns([
  [
    ({ x, y }) => ({ x: x + 1, y }),
    (count, current, origin, state) => {
      if (count === 0) return isCellUnderCheck(state, current);
      if (count === 1 && current.y === 0) {
        const hasCastlingRights = getCastlingRights(
          R.path([origin.y, origin.x, 'piece'], state.board),
          state
        );
        if (!hasCastlingRights.kingSide) return true;
        return (
          isCellUnderCheck(state, current) || isCellOccupied(state, current)
        );
      }
      return true;
    },
  ],
  [
    ({ x, y }) => ({ x: x - 1, y }),
    (count, current, origin, state) => {
      if (count === 0) return isCellUnderCheck(state, current);
      if (count === 1 && current.y === 0) {
        const hasCastlingRights = getCastlingRights(
          R.path([origin.y, origin.x, 'piece'], state.board),
          state
        );
        if (!hasCastlingRights.queenSide) return true;
        return (
          anyCellUnderCheck(state, [
            current,
            { y: current.y, x: current.x - 1 },
          ]) ||
          anyCellOccupied(state, [current, { y: current.y, x: current.x - 1 }])
        );
      }
      return true;
    },
  ],
  [({ x, y }) => ({ x, y: y - 1 }), canKingMoveHere],
  [({ x, y }) => ({ x, y: y + 1 }), canKingMoveHere],
  [({ x, y }) => ({ x: x + 1, y: y + 1 }), canKingMoveHere],
  [({ x, y }) => ({ x: x - 1, y: y + 1 }), canKingMoveHere],
  [({ x, y }) => ({ x: x - 1, y: y - 1 }), canKingMoveHere],
  [({ x, y }) => ({ x: x + 1, y: y - 1 }), canKingMoveHere],
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
    p: generatePawnMoves(rejectFn),
    P: withRotatedBoard(generatePawnMoves(rejectFn)),
    n: generateKnightMoves(rejectFn),
    N: generateKnightMoves(rejectFn),
    b: generateBishopMoves(rejectFn),
    B: generateBishopMoves(rejectFn),
    r: generateRookMoves(rejectFn),
    R: generateRookMoves(rejectFn),
    q: generateQueenMoves(rejectFn),
    Q: withRotatedBoard(generateQueenMoves(rejectFn)),
    k: generateKingMoves(rejectFn),
    K: withRotatedBoard(generateKingMoves(rejectFn)),
  };

  const selected = { coord, flag: { [flags.selected]: true } };
  const piece = R.path([coord.y, coord.x, 'piece'], state.board);
  const generateMovesFn = R.prop(piece, generateMovesMap);
  const moves = generateMovesFn(coord, state);

  return R.prepend(selected, moves);
};
