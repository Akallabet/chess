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

const calcPawnMoves = (coord = { x: 0, y: 0 }, { board }) => {
  const moves = [];
  let isValid = true;
  while (isValid) {
    const lastMove = R.last(moves) || coord;
    const currentMove = { x: lastMove.x, y: lastMove.y + 1 };
    const row = board[currentMove.y];
    if (!row) {
      isValid = false;
      break;
    }
    const cell = board[currentMove.y][currentMove.x];

    if (!cell) {
      isValid = false;
      break;
    }
    if (cell.piece) {
      isValid = false;
      break;
    }
    if (coord.y > 1 && currentMove.y > coord.y + 1) {
      isValid = false;
      break;
    }
    if (coord.y === 1 && currentMove.y > coord.y + 2) {
      isValid = false;
      break;
    }
    moves.push(currentMove);
  }
  return R.map(coord => ({ coord, addFlag: addMoveFlag }), moves);
};

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
  if (limit(count, state)) return moves;
  const { board } = state;
  const lastMove = R.last(moves) || { coord };
  const currentMove = pattern(lastMove.coord, state);
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

const mapMovesToBoard = R.curry((moves, board) =>
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

const calcPieceMoves = R.curryN(
  4,
  (patterns = [], limit, coord = { x: 0, y: 0 }, state, moves = []) => {
    if (patterns.length === 0)
      return mapMovesToBoard(
        [{ coord, addFlag: addSelectedFlag }, ...moves],
        state.board
      );

    return calcPieceMoves(
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

const calcKnightMoves = calcPieceMoves(
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

const calcBishopMoves = calcPieceMoves(
  [
    ({ x, y }) => ({ x: x + 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y + 1 }),
    ({ x, y }) => ({ x: x - 1, y: y - 1 }),
    ({ x, y }) => ({ x: x + 1, y: y - 1 }),
  ],
  R.F
);
const calcRookMoves = calcPieceMoves(
  [
    ({ x, y }) => ({ x: x + 1, y }),
    ({ x, y }) => ({ x: x - 1, y }),
    ({ x, y }) => ({ x, y: y - 1 }),
    ({ x, y }) => ({ x, y: y + 1 }),
  ],
  R.F
);
const calcQueenMoves = calcPieceMoves(
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
const calcKingMoves = calcPieceMoves(
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

const pieceMovesList = {
  p: R.curry((coord, state) => {
    const moves = [
      { coord, addFlag: addSelectedFlag },
      ...calcPawnMoves(coord, state),
      ...calcPawnCaptures(coord, state),
    ];
    return mapMovesToBoard(moves, state.board);
  }),
  P: R.curry((coord, { board }) =>
    R.pipe(
      rotate,
      board => ({ board }),
      pieceMovesList.p({ x: 7 - coord.x, y: 7 - coord.y }),
      rotate
    )(board)
  ),
  n: calcKnightMoves,
  N: calcKnightMoves,
  b: calcBishopMoves,
  B: calcBishopMoves,
  r: calcRookMoves,
  R: calcRookMoves,
  q: calcQueenMoves,
  Q: calcQueenMoves,
  k: calcKingMoves,
  K: calcKingMoves,
};
export const highlightMoves = (coord, state) => {
  return pieceMovesList[state.board[coord.y][coord.x].piece](coord, state);
};
