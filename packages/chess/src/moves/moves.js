import * as R from 'ramda';
const mapI = R.addIndex(R.map);

const isWhitePiece = piece => new RegExp(/[PNBRQK]+/).test(piece);
const isBlackPiece = piece => new RegExp(/[pnbrqk]+/).test(piece);
const areOpponents = (pa, pb) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

const addMoveFlag = R.assoc('move', true);
const addCaptureFlag = R.assoc('capture', true);
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
  if (
    nextRank[coord.x + 1].piece &&
    areOpponents(board[coord.y][coord.x].piece, nextRank[coord.x + 1].piece)
  ) {
    captures.push({ x: coord.x + 1, y: coord.y + 1 });
  }
  return R.map(coord => ({ coord, addFlag: addCaptureFlag }), captures);
});

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

const pieceMovesList = {
  p: (coord = { x: 0, y: 0 }, state) => {
    const moves = [
      ...calcPawnMoves(coord, state),
      ...calcPawnCaptures(coord, state),
    ];
    return mapMovesToBoard(moves, state.board);
  },
  n: ({ x, y }, { board }) => {
    console.log(y, x);
    return board;
  },
  P: ({ x, y }, { board }) => {
    console.log(y, x);
    return board;
  },
};
export const getPieceMoves = (piece, coord, state) =>
  pieceMovesList[piece](coord, state);
