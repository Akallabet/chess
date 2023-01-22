import * as R from 'ramda';
import { rotate } from '../utils/index.js';
const mapI = R.addIndex(R.map);

const isWhitePiece = piece => new RegExp(/[PNBRQK]+/).test(piece);
const isBlackPiece = piece => new RegExp(/[pnbrqk]+/).test(piece);
const areOpponents = (pa, pb) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

const addMoveFlag = R.assoc('move', true);
const addCaptureFlag = R.assoc('capture', true);
const addSelectedFlag = R.assoc('selected', true);
const isSamePos =
  ({ x, y }) =>
  m =>
    m.y === y && m.x === x;

const mapMovesToBoard = R.curry((board, moves) =>
  mapI(
    (row, y) =>
      mapI((cell, x) => {
        const move = R.find(
          R.pipe(R.prop('coord'), isSamePos({ x, y })),
          moves
        );
        return move ? move.addFlag(cell) : cell;
      }, row),
    board
  )
);

const calcPawnCaptures = R.curry((coord = { x: 0, y: 0 }, { board }) => {
  const captures = [];
  const nextRank = board[coord.y + 1];
  if (!nextRank) return captures;
  if (!nextRank[coord.x - 1]) return captures;
  if (
    nextRank[coord.x - 1].piece &&
    areOpponents(board[coord.y][coord.x].piece, nextRank[coord.x - 1].piece)
  ) {
    captures.push({ x: coord.x - 1, y: coord.y + 1 });
  }
  if (!nextRank[coord.x + 1]) return captures;
  if (
    nextRank[coord.x + 1].piece &&
    areOpponents(board[coord.y][coord.x].piece, nextRank[coord.x + 1].piece)
  ) {
    captures.push({ x: coord.x + 1, y: coord.y + 1 });
  }
  return R.map(coord => ({ coord, addFlag: addCaptureFlag }), captures);
});

const calcMovesFromPattern = (
  pattern,
  limit,
  count,
  moves = [],
  coord,
  state
) => {
  const lastMove = R.last(moves) || { coord };
  const currentMove = pattern(lastMove.coord, state);
  if (limit(count, currentMove, coord, state)) return moves;
  const { board } = state;
  const row = board[currentMove.y];
  if (!row) return moves;
  const cell = board[currentMove.y][currentMove.x];
  if (!cell) return moves;
  if (cell.piece && !areOpponents(cell.piece, board[coord.y][coord.x].piece))
    return moves;
  if (cell.piece && areOpponents(cell.piece, board[coord.y][coord.x].piece)) {
    moves.push({ coord: currentMove, addFlag: addCaptureFlag });
    return moves;
  }
  if (!cell.piece) moves.push({ coord: currentMove, addFlag: addMoveFlag });
  return calcMovesFromPattern(pattern, limit, count + 1, moves, coord, state);
};

const calcMovesFromPatterns = R.curryN(
  4,
  (patterns = [], limit, coord = { x: 0, y: 0 }, state, moves = []) => {
    if (patterns.length === 0) return moves;
    return calcMovesFromPatterns(
      R.slice(1, Infinity, patterns),
      limit,
      coord,
      state,
      R.concat(
        moves,
        calcMovesFromPattern(R.head(patterns), limit, 0, [], coord, state)
      )
    );
  }
);
const highlightMovesFromPatterns = R.curryN(
  4,
  (patterns = [], limit, coord = { x: 0, y: 0 }, state) => {
    const moves = [
      { coord, addFlag: addSelectedFlag },
      ...calcMovesFromPatterns(patterns, limit, coord, state),
    ];
    return mapI(
      (row, y) =>
        mapI((cell, x) => {
          const move = R.find(
            R.pipe(R.prop('coord'), isSamePos({ x, y })),
            moves
          );
          return move ? move.addFlag(cell) : cell;
        }, row),
      state.board
    );
  }
);

const highlightKnightMoves = highlightMovesFromPatterns(
  [
    ({ x, y }) => ({ x: x + 2, y: y + 1 }),
    ({ x, y }) => ({ x: x + 1, y: y + 2 }),
    ({ x, y }) => ({ x: x - 1, y: y + 2 }),
    ({ x, y }) => ({ x: x - 2, y: y + 1 }),
    ({ x, y }) => ({ x: x - 2, y: y - 1 }),
    ({ x, y }) => ({ x: x - 1, y: y - 2 }),
    ({ x, y }) => ({ x: x + 1, y: y - 2 }),
    ({ x, y }) => ({ x: x + 2, y: y - 1 }),
  ],
  count => count >= 1
);

const highlightBishopMoves = highlightMovesFromPatterns(
  [
    ({ x, y }) => ({ x: x + 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y - 1 }),
    ({ x, y }) => ({ x: x + 1, y: y - 1 }),
  ],
  R.F
);
const highlightRookMoves = highlightMovesFromPatterns(
  [
    ({ x, y }) => ({ x: x + 1, y }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
  ],
  R.F
);
const highlightQueenMoves = highlightMovesFromPatterns(
  [
    ({ x, y }) => ({ x: x + 1, y }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
    ({ x, y }) => ({ x: x + 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y - 1 }),
    ({ x, y }) => ({ x: x + 1, y: y - 1 }),
  ],
  R.F
);
const highlightKingMoves = highlightMovesFromPatterns(
  [
    ({ x, y }) => ({ x: x + 1, y }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
    ({ x, y }) => ({ x: x + 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y - 1 }),
    ({ x, y }) => ({ x: x + 1, y: y - 1 }),
  ],
  limit => limit >= 1
);

const highlighMovesMap = {
  p: R.curry((coord, state) => {
    const moves = [
      { coord, addFlag: addSelectedFlag },
      ...calcMovesFromPattern(
        ({ x, y }) => ({ x, y: y + 1 }),
        (count, { x, y }, start, { board }) => {
          if (board[y][x].piece) return true;
          if (start.y > 1 && count >= 1) return true;
          if (start.y === 1 && count >= 2) return true;
        },
        0,
        [],
        coord,
        state
      ),
      ...calcPawnCaptures(coord, state),
    ];
    return mapMovesToBoard(state.board, moves);
  }),
  P: R.curry((coord, { board }) =>
    R.pipe(
      rotate,
      board => ({ board }),
      highlighMovesMap.p({ x: 7 - coord.x, y: 7 - coord.y }),
      rotate
    )(board)
  ),
  n: highlightKnightMoves,
  N: highlightKnightMoves,
  b: highlightBishopMoves,
  B: highlightBishopMoves,
  r: highlightRookMoves,
  R: highlightRookMoves,
  q: highlightQueenMoves,
  Q: highlightQueenMoves,
  k: highlightKingMoves,
  K: highlightKingMoves,
};

export const highlightMoves = (coord, state) => {
  return highlighMovesMap[state.board[coord.y][coord.x].piece](coord, state);
};
