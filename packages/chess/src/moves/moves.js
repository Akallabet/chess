import * as R from 'ramda';
import { flags } from '../constants.js';
// import { movePiece } from '../move.js';
import {
  areOpponents,
  // getPieceCoord,
  overProp,
  rotate,
} from '../utils/index.js';
// import { isCellInMoves } from './is-cell-in-moves.js';
const mapI = R.addIndex(R.map);

const addMoveFlag = R.assoc(flags.move, true);
const addCaptureFlag = R.assoc(flags.capture, true);
const addSelectedFlag = R.assoc(flags.selected, true);
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
  originCoord,
  state
) => {
  const lastMove = R.last(moves);
  const currentCoord = pattern(lastMove.coord, state);
  if (limit(count, currentCoord, originCoord, state)) return moves;
  const { board } = state;
  const row = board[currentCoord.y];
  if (!row) return moves;
  const cell = board[currentCoord.y][currentCoord.x];
  if (!cell) return moves;
  if (
    cell.piece &&
    !areOpponents(cell.piece, board[originCoord.y][originCoord.x].piece)
  )
    return moves;
  if (
    cell.piece &&
    areOpponents(cell.piece, board[originCoord.y][originCoord.x].piece)
  ) {
    moves.push({ coord: currentCoord, addFlag: addCaptureFlag });
    return moves;
  }
  if (!cell.piece) moves.push({ coord: currentCoord, addFlag: addMoveFlag });
  return calcMovesFromPattern(
    pattern,
    limit,
    count + 1,
    moves,
    originCoord,
    state
  );
};

const calcMovesFromPatterns = (
  patterns = [],
  limit,
  originCoord = { x: 0, y: 0 },
  state,
  moves = []
) => {
  if (patterns.length === 0) return moves;
  return calcMovesFromPatterns(
    R.slice(1, Infinity, patterns),
    limit,
    originCoord,
    state,
    R.concat(
      moves,
      calcMovesFromPattern(
        R.head(patterns),
        limit,
        0,
        [{ coord: originCoord }],
        originCoord,
        state
      )
    )
  );
};

const highlightMovesFromPatterns =
  (patterns = [], limit) =>
  (originCoord = { x: 0, y: 0 }, state) => {
    const moves = calcMovesFromPatterns(patterns, limit, originCoord, state);
    return [{ coord: originCoord, addFlag: addSelectedFlag }, ...moves];
  };

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

// const isKingUnderAttack = (king, state, origin) => {
//   return move => {
//     const board = movePiece(origin, move, state.board);
//     const kingCoord = getPieceCoord(king, board);
//     isCellInMoves(kingCoord);
//   };
// };

const highlightPawnMoves = (coord, state) => [
  { coord, addFlag: addSelectedFlag },
  ...calcMovesFromPattern(
    ({ x, y }) => ({ x, y: y + 1 }),
    (count, { x, y }, start, { board }) => {
      if (!board[y]) return true;
      if (board[y][x].piece) return true;
      if (start.y > 1 && count >= 1) return true;
      if (start.y === 1 && count >= 2) return true;
    },
    0,
    [{ coord }],
    coord,
    state
  ),
  ...calcPawnCaptures(coord, state),
];

const highlightWhitePawnMoves = (coord, state) =>
  R.pipe(
    rotate,
    board => highlightPawnMoves({ x: 7 - coord.x, y: 7 - coord.y }, { board }),
    R.map(overProp('coord', ({ y, x }) => ({ y: 7 - y, x: 7 - x })))
  )(state.board);

export const highlightMoves = (coord, state /* rejectFn = R.F */) => {
  const highlighMovesMap = {
    p: highlightPawnMoves,
    P: highlightWhitePawnMoves,
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
  const piece = R.path([coord.y, coord.x, 'piece'], state.board);
  const highlightMovesFn = R.prop(piece, highlighMovesMap);
  const moves = highlightMovesFn(coord, state);

  return mapMovesToBoard(
    state.board,
    // R.reject(isKingUnderAttack(king, state, coord), moves)
    moves
  );
};
