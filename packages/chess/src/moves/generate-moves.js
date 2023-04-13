import * as R from 'ramda';
import { flags, modesList } from '../constants.js';
import { getCastlingRights } from '../fen/index.js';
import { modesMap } from '../modes.js';
import {
  areOpponents,
  anyCellOccupied,
  isCellOccupied,
  getPieceColor,
} from '../utils/index.js';
import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';

const generateMovesFromPattern = (
  pattern,
  count,
  moves = [],
  originCoord,
  state
) => {
  const { step, shallStop, flag, rejectMove } = pattern;
  const lastMove = R.last(moves) || { coord: originCoord };
  const currentCoord = step(lastMove.coord, state);
  const row = state.board[currentCoord.y];
  if (!row) return moves;
  const cell = state.board[currentCoord.y][currentCoord.x];
  if (!cell) return moves;
  if (
    cell.piece &&
    !areOpponents(cell.piece, state.board[originCoord.y][originCoord.x].piece)
  )
    return moves;
  if (shallStop(count, currentCoord, originCoord, state)) return moves;
  const invalid = rejectMove(originCoord, state, currentCoord);
  if (
    cell.piece &&
    areOpponents(cell.piece, state.board[originCoord.y][originCoord.x].piece)
  ) {
    return R.append(
      {
        coord: currentCoord,
        flag: { [flag || flags.capture]: true },
        invalid,
      },
      moves
    );
  }
  if (!cell.piece)
    moves.push({
      coord: currentCoord,
      flag: {
        [flag || flags.move]: true,
        // [flags.check]: isCheck(originCoord, currentCoord, state),
      },
      invalid,
    });
  return generateMovesFromPattern(
    pattern,
    count + 1,
    moves,
    originCoord,
    state
  );
};

const generateMovesFromPatterns = ({ patterns, origin, state, moves = [] }) => {
  if (patterns.length === 0) return moves.filter(move => !move.invalid);
  return generateMovesFromPatterns({
    patterns: R.slice(1, Infinity, patterns),
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

const shouldKingStop = (count, current, origin, state) =>
  count > 0 ||
  isCellUnderCheck(
    state,
    getPieceColor(R.path([origin.y, origin.x, 'piece'], state.board)),
    current
  );

const kingsideCastlingMove = startRow => (count, current, origin, state) => {
  if (count === 0)
    return isCellUnderCheck(
      state,
      getPieceColor(R.path([origin.y, origin.x, 'piece'], state.board)),
      current
    );
  if (count === 1 && current.y === startRow) {
    const hasCastlingRights = getCastlingRights(
      R.path([origin.y, origin.x, 'piece'], state.board),
      state
    );
    if (!hasCastlingRights.kingSide) return true;
    return (
      isCellUnderCheck(
        state,
        getPieceColor(R.path([origin.y, origin.x, 'piece'], state.board)),
        current
      ) || isCellOccupied(state, current)
    );
  }
  return true;
};
const queensideCastlingMove = startRow => (count, current, origin, state) => {
  if (count === 0)
    return isCellUnderCheck(
      state,
      getPieceColor(R.path([origin.y, origin.x, 'piece'], state.board)),
      current
    );
  if (count === 1 && current.y === startRow) {
    const hasCastlingRights = getCastlingRights(
      R.path([origin.y, origin.x, 'piece'], state.board),
      state
    );
    if (!hasCastlingRights.queenSide) return true;
    return (
      anyCellUnderCheck(
        state,
        getPieceColor(R.path([origin.y, origin.x, 'piece'], state.board)),
        [current, { y: current.y, x: current.x - 1 }]
      ) || anyCellOccupied(state, [current, { y: current.y, x: current.x - 1 }])
    );
  }
  return true;
};

const topLeft = ({ x, y }) => ({ x: x - 1, y: y - 1 });
const topRight = ({ x, y }) => ({ x: x - 1, y: y + 1 });
const bottomLeft = ({ x, y }) => ({ x: x + 1, y: y - 1 });
const bottomRight = ({ x, y }) => ({ x: x + 1, y: y + 1 });
const top = ({ x, y }) => ({ x, y: y - 1 });
const bottom = ({ x, y }) => ({ x, y: y + 1 });
const right = ({ x, y }) => ({ x: x + 1, y });
const left = ({ x, y }) => ({ x: x - 1, y });

const getPatterns = rejectMove => ({
  p: [
    {
      step: bottom,
      shallStop: (count, _, start) => {
        if (start.y > 1 && count >= 1) return true;
        if (start.y === 1 && count >= 2) return true;
      },
      rejectMove,
    },
    {
      step: bottomRight,
      shallStop: stopIfOpponent,
      flag: flags.capture,
      rejectMove,
    },
    {
      step: topRight,
      shallStop: stopIfOpponent,
      flag: flags.capture,
      rejectMove,
    },
  ],
  n: [
    {
      step: ({ x, y }) => ({ x: x + 2, y: y + 1 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x + 1, y: y + 2 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x - 1, y: y + 2 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x - 2, y: y + 1 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x - 2, y: y - 1 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x - 1, y: y - 2 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x + 1, y: y - 2 }),
      shallStop: R.lte(1),
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x + 2, y: y - 1 }),
      shallStop: R.lte(1),
      rejectMove,
    },
  ],
  b: [
    { step: bottomRight, shallStop: R.F, rejectMove },
    { step: topRight, shallStop: R.F, rejectMove },
    { step: topLeft, shallStop: R.F, rejectMove },
    { step: bottomLeft, shallStop: R.F, rejectMove },
  ],
  r: [
    { step: right, shallStop: R.F, rejectMove },
    { step: left, shallStop: R.F, rejectMove },
    { step: top, shallStop: R.F, rejectMove },
    { step: bottom, shallStop: R.F, rejectMove },
  ],
  q: [
    { step: right, shallStop: R.F, rejectMove },
    { step: left, shallStop: R.F, rejectMove },
    { step: top, shallStop: R.F, rejectMove },
    { step: bottom, shallStop: R.F, rejectMove },
    { step: bottomRight, shallStop: R.F, rejectMove },
    { step: topRight, shallStop: R.F, rejectMove },
    { step: topLeft, shallStop: R.F, rejectMove },
    { step: bottomLeft, shallStop: R.F, rejectMove },
  ],
  P: [
    {
      step: top,
      shallStop: (count, _, start) => {
        if (start.y < 6 && count >= 1) return true;
        if (start.y === 6 && count >= 2) return true;
      },
      rejectMove,
    },
    {
      step: bottomLeft,
      shallStop: stopIfOpponent,
      flag: flags.capture,
      rejectMove,
    },
    {
      step: ({ x, y }) => ({ x: x - 1, y: y - 1 }),
      shallStop: stopIfOpponent,
      flag: flags.capture,
      rejectMove,
    },
  ],
});

export const generateMoves = (coord, state) => {
  const selected = { coord, flag: { [flags.selected]: true } };
  const piece = R.path([coord.y, coord.x, 'piece'], state.board);

  const kingMoves = [
    { step: right, shallStop: R.lte(1), rejectMove: R.F },
    { step: left, shallStop: R.lte(1), rejectMove: R.F },
    { step: top, shallStop: R.lte(1), rejectMove: R.F },
    { step: bottom, shallStop: R.lte(1), rejectMove: R.F },
    { step: bottomRight, shallStop: R.lte(1), rejectMove: R.F },
    { step: topRight, shallStop: R.lte(1), rejectMove: R.F },
    { step: topLeft, shallStop: R.lte(1), rejectMove: R.F },
    { step: bottomLeft, shallStop: R.lte(1), rejectMove: R.F },
  ];

  const patterns = getPatterns(R.F);
  patterns.k = kingMoves;
  patterns.K = kingMoves;

  const moves = generateMovesFromPatterns({
    patterns: patterns[piece] || patterns[piece.toLowerCase()],
    state,
    origin: coord,
    moves: [],
  });
  moves.unshift(selected);
  return moves;
};

export const generateLegalMoves = (coord, state) => {
  const { rejectMove, addCheckFlag } = modesMap[state.mode || modesList[0]];
  const selected = { coord, flag: { [flags.selected]: true } };
  const piece = R.path([coord.y, coord.x, 'piece'], state.board);

  const patterns = getPatterns(rejectMove);
  const kingMoves = [
    { step: top, shallStop: shouldKingStop, rejectMove: R.F },
    { step: bottom, shallStop: shouldKingStop, rejectMove: R.F },
    { step: bottomRight, shallStop: shouldKingStop, rejectMove: R.F },
    { step: topRight, shallStop: shouldKingStop, rejectMove: R.F },
    { step: topLeft, shallStop: shouldKingStop, rejectMove: R.F },
    { step: bottomLeft, shallStop: shouldKingStop, rejectMove: R.F },
  ];
  patterns.k = kingMoves.concat([
    { step: right, shallStop: kingsideCastlingMove(0), rejectMove: R.F },
    { step: left, shallStop: queensideCastlingMove(0), rejectMove: R.F },
  ]);
  patterns.K = kingMoves.concat([
    { step: right, shallStop: kingsideCastlingMove(7), rejectMove: R.F },
    { step: left, shallStop: queensideCastlingMove(7), rejectMove: R.F },
  ]);

  const moves = generateMovesFromPatterns({
    patterns: patterns[piece] || patterns[piece.toLowerCase()],
    state,
    origin: coord,
    moves: [],
  }).map(addCheckFlag(coord, state));
  moves.unshift(selected);
  return moves;
};
