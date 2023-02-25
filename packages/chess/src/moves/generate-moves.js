import * as R from 'ramda';
import { flags } from '../constants.js';
import { getCastlingRights } from '../fen/index.js';
import {
  areOpponents,
  anyCellOccupied,
  isCellOccupied,
  getPieceColor,
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
  if (
    cell.piece &&
    !areOpponents(cell.piece, state.board[originCoord.y][originCoord.x].piece)
  )
    return moves;
  if (limit(count, currentCoord, originCoord, state)) return moves;
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

const generateMovesFromPatterns = ({
  patterns,
  rejectFn,
  origin,
  state,
  moves = [],
}) => {
  if (patterns.length === 0) return R.reject(rejectFn(origin, state), moves);
  return generateMovesFromPatterns({
    patterns: R.slice(1, Infinity, patterns),
    rejectFn,
    origin,
    state,
    moves: R.concat(
      moves,
      generateMovesFromPattern(R.head(patterns), 0, [], origin, state)
    ),
  });
};

const stopIfOpponent = (_, { x, y }, start, { board }) => {
  if (
    board[y][x].piece &&
    areOpponents(board[y][x].piece, board[start.y][start.x].piece)
  )
    return false;
  return true;
};

const canKingMoveHere = (count, current, _, state) =>
  count === 0 &&
  isCellUnderCheck(
    state,
    getPieceColor(R.path([current.y, current.x, 'piece'], state.board)),
    current
  );

const patterns = {
  p: [
    [
      ({ x, y }) => ({ x, y: y + 1 }),
      (count, _, start) => {
        if (start.y > 1 && count >= 1) return true;
        if (start.y === 1 && count >= 2) return true;
      },
    ],
    [({ x, y }) => ({ x: x + 1, y: y + 1 }), stopIfOpponent, flags.capture],
    [({ x, y }) => ({ x: x - 1, y: y + 1 }), stopIfOpponent, flags.capture],
  ],
  n: [
    [({ x, y }) => ({ x: x + 2, y: y + 1 }), R.lte(1)],
    [({ x, y }) => ({ x: x + 1, y: y + 2 }), R.lte(1)],
    [({ x, y }) => ({ x: x - 1, y: y + 2 }), R.lte(1)],
    [({ x, y }) => ({ x: x - 2, y: y + 1 }), R.lte(1)],
    [({ x, y }) => ({ x: x - 2, y: y - 1 }), R.lte(1)],
    [({ x, y }) => ({ x: x - 1, y: y - 2 }), R.lte(1)],
    [({ x, y }) => ({ x: x + 1, y: y - 2 }), R.lte(1)],
    [({ x, y }) => ({ x: x + 2, y: y - 1 }), R.lte(1)],
  ],
  b: [
    [({ x, y }) => ({ x: x + 1, y: y + 1 }), R.F],
    [({ x, y }) => ({ x: x - 1, y: y + 1 }), R.F],
    [({ x, y }) => ({ x: x - 1, y: y - 1 }), R.F],
    [({ x, y }) => ({ x: x + 1, y: y - 1 }), R.F],
  ],
  r: [
    [({ x, y }) => ({ x: x + 1, y }), R.F],
    [({ x, y }) => ({ x: x - 1, y }), R.F],
    [({ x, y }) => ({ x, y: y - 1 }), R.F],
    [({ x, y }) => ({ x, y: y + 1 }), R.F],
  ],
  q: [
    [({ x, y }) => ({ x: x + 1, y }), R.F],
    [({ x, y }) => ({ x: x - 1, y }), R.F],
    [({ x, y }) => ({ x, y: y - 1 }), R.F],
    [({ x, y }) => ({ x, y: y + 1 }), R.F],
    [({ x, y }) => ({ x: x + 1, y: y + 1 }), R.F],
    [({ x, y }) => ({ x: x - 1, y: y + 1 }), R.F],
    [({ x, y }) => ({ x: x - 1, y: y - 1 }), R.F],
    [({ x, y }) => ({ x: x + 1, y: y - 1 }), R.F],
  ],
  k: [
    [
      ({ x, y }) => ({ x: x + 1, y }),
      (count, current, origin, state) => {
        if (count === 0)
          return isCellUnderCheck(
            state,
            getPieceColor(R.path([current.y, current.x, 'piece'], state.board)),
            current
          );
        if (count === 1 && current.y === 0) {
          const hasCastlingRights = getCastlingRights(
            R.path([origin.y, origin.x, 'piece'], state.board),
            state
          );
          if (!hasCastlingRights.kingSide) return true;
          return (
            isCellUnderCheck(
              state,
              getPieceColor(
                R.path([current.y, current.x, 'piece'], state.board)
              ),
              current
            ) || isCellOccupied(state, current)
          );
        }
        return true;
      },
    ],
    [
      ({ x, y }) => ({ x: x - 1, y }),
      (count, current, origin, state) => {
        if (count === 0)
          return isCellUnderCheck(
            state,
            getPieceColor(R.path([current.y, current.x, 'piece'], state.board)),
            current
          );
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
            anyCellOccupied(state, [
              current,
              { y: current.y, x: current.x - 1 },
            ])
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
  ],
  P: [
    [
      ({ x, y }) => ({ x, y: y - 1 }),
      (count, _, start) => {
        if (start.y < 6 && count >= 1) return true;
        if (start.y === 6 && count >= 2) return true;
      },
    ],
    [({ x, y }) => ({ x: x + 1, y: y - 1 }), stopIfOpponent, flags.capture],
    [({ x, y }) => ({ x: x - 1, y: y - 1 }), stopIfOpponent, flags.capture],
  ],
  K: [
    [
      ({ x, y }) => ({ x: x - 1, y }),
      (count, current, origin, state) => {
        if (count === 0)
          return isCellUnderCheck(
            state,
            getPieceColor(R.path([current.y, current.x, 'piece'], state.board)),
            current
          );
        if (count === 1 && current.y === 0) {
          const hasCastlingRights = getCastlingRights(
            R.path([origin.y, origin.x, 'piece'], state.board),
            state
          );
          if (!hasCastlingRights.kingSide) return true;
          return (
            isCellUnderCheck(
              state,
              getPieceColor(
                R.path([current.y, current.x, 'piece'], state.board)
              ),
              current
            ) || isCellOccupied(state, current)
          );
        }
        return true;
      },
    ],
    [
      ({ x, y }) => ({ x: x + 1, y }),
      (count, current, origin, state) => {
        if (count === 0)
          return isCellUnderCheck(
            state,
            getPieceColor(R.path([current.y, current.x, 'piece'], state.board)),
            current
          );
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
            anyCellOccupied(state, [
              current,
              { y: current.y, x: current.x - 1 },
            ])
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
  ],
};

export const generateMoves = (coord, state, rejectFn = R.F) => {
  const selected = { coord, flag: { [flags.selected]: true } };
  const piece = R.path([coord.y, coord.x, 'piece'], state.board);
  const moves = generateMovesFromPatterns({
    patterns: patterns[piece] || patterns[piece.toLowerCase()],
    rejectFn,
    state,
    origin: coord,
    moves: [],
  });

  return R.prepend(selected, moves);
};
