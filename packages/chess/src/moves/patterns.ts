import { flags, modesList } from '../constants.js';
import { Coordinates, InternalState } from '../types.js';

import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';
import { getCastlingRights } from '../fen/index.js';
import {
  areOpponents,
  anyCellOccupied,
  isCellOccupied,
  getPieceColor,
} from '../utils/index.js';
import { modesMap } from '../modes.js';

const F = () => false;
const lte = (n: number) => (count: number) => count <= n;

const topLeft = ({ x, y }: Coordinates): Coordinates => ({
  x: x - 1,
  y: y - 1,
});
const topght = ({ x, y }: Coordinates): Coordinates => ({
  x: x - 1,
  y: y + 1,
});
const bottomLeft = ({ x, y }: Coordinates): Coordinates => ({
  x: x + 1,
  y: y - 1,
});
const bottomght = ({ x, y }: Coordinates): Coordinates => ({
  x: x + 1,
  y: y + 1,
});
const top = ({ x, y }: Coordinates): Coordinates => ({ x, y: y - 1 });
const bottom = ({ x, y }: Coordinates): Coordinates => ({ x, y: y + 1 });
const right = ({ x, y }: Coordinates): Coordinates => ({ x: x + 1, y });
const left = ({ x, y }: Coordinates): Coordinates => ({ x: x - 1, y });

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
    getPieceColor(state.board[origin.y][origin.x].piece),
    current
  );

const kingsideCastlingMove = startRow => (count, current, origin, state) => {
  if (count === 0)
    return isCellUnderCheck(
      state,
      getPieceColor(state.board[origin.y][origin.x].piece),
      current
    );
  if (count === 1 && current.y === startRow) {
    const hasCastlingRights = getCastlingRights(
      state.board[origin.y][origin.x].piece,
      state
    );
    if (!hasCastlingRights.kingSide) return true;
    return (
      isCellUnderCheck(
        state,
        getPieceColor(state.board[origin.y][origin.x].piece),
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
      getPieceColor(state.board[origin.y][origin.x].piece),
      current
    );
  if (count === 1 && current.y === startRow) {
    const hasCastlingRights = getCastlingRights(
      state.board[origin.y][origin.x].piece,
      state
    );
    if (!hasCastlingRights.queenSide) return true;
    return (
      anyCellUnderCheck(
        state,
        getPieceColor(state.board[origin.y][origin.x].piece),
        [current, { y: current.y, x: current.x - 1 }]
      ) || anyCellOccupied(state, [current, { y: current.y, x: current.x - 1 }])
    );
  }
  return true;
};

export function getPatternsForLegalMoves(state: InternalState) {
  const { rejectMove } = modesMap[state.mode || modesList[0]];

  const kingMoves = [
    { step: top, shallStop: shouldKingStop, rejectMove: F },
    { step: bottom, shallStop: shouldKingStop, rejectMove: F },
    { step: bottomght, shallStop: shouldKingStop, rejectMove: F },
    { step: topght, shallStop: shouldKingStop, rejectMove: F },
    { step: topLeft, shallStop: shouldKingStop, rejectMove: F },
    { step: bottomLeft, shallStop: shouldKingStop, rejectMove: F },
  ];
  const patterns = getPatterns(rejectMove);
  patterns.k = kingMoves.concat([
    { step: right, shallStop: kingsideCastlingMove(0), rejectMove: F },
    { step: left, shallStop: queensideCastlingMove(0), rejectMove: F },
  ]);
  patterns.K = kingMoves.concat([
    { step: right, shallStop: kingsideCastlingMove(7), rejectMove: F },
    { step: left, shallStop: queensideCastlingMove(7), rejectMove: F },
  ]);
  return patterns;
}

export function getPatternsForMoves() {
  const kingMoves = [
    { step: right, shallStop: lte(1), rejectMove: F },
    { step: left, shallStop: lte(1), rejectMove: F },
    { step: top, shallStop: lte(1), rejectMove: F },
    { step: bottom, shallStop: lte(1), rejectMove: F },
    { step: bottomght, shallStop: lte(1), rejectMove: F },
    { step: topght, shallStop: lte(1), rejectMove: F },
    { step: topLeft, shallStop: lte(1), rejectMove: F },
    { step: bottomLeft, shallStop: lte(1), rejectMove: F },
  ];

  const patterns = getPatterns(() => false);
  patterns.k = kingMoves;
  patterns.K = kingMoves;

  return patterns;
}

export function getPatterns(rejectMove: () => boolean) {
  return {
    p: [
      {
        step: bottom,
        shallStop: (count: number, _: any, start: Coordinates) => {
          if (start.y > 1 && count >= 1) return true;
          if (start.y === 1 && count >= 2) return true;
        },
        rejectMove,
      },
      {
        step: bottomght,
        shallStop: stopIfOpponent,
        flags: flags.capture,
        rejectMove,
      },
      {
        step: topght,
        shallStop: stopIfOpponent,
        flags: flags.capture,
        rejectMove,
      },
    ],
    n: [
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x + 2, y: y + 1 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x + 1, y: y + 2 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x - 1, y: y + 2 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x - 2, y: y + 1 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x - 2, y: y - 1 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x - 1, y: y - 2 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x + 1, y: y - 2 }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x + 2, y: y - 1 }),
        shallStop: lte(1),
        rejectMove,
      },
    ],
    b: [
      { step: bottomght, shallStop: F, rejectMove },
      { step: topght, shallStop: F, rejectMove },
      { step: topLeft, shallStop: F, rejectMove },
      { step: bottomLeft, shallStop: F, rejectMove },
    ],
    r: [
      { step: right, shallStop: F, rejectMove },
      { step: left, shallStop: F, rejectMove },
      { step: top, shallStop: F, rejectMove },
      { step: bottom, shallStop: F, rejectMove },
    ],
    q: [
      { step: right, shallStop: F, rejectMove },
      { step: left, shallStop: F, rejectMove },
      { step: top, shallStop: F, rejectMove },
      { step: bottom, shallStop: F, rejectMove },
      { step: bottomght, shallStop: F, rejectMove },
      { step: topght, shallStop: F, rejectMove },
      { step: topLeft, shallStop: F, rejectMove },
      { step: bottomLeft, shallStop: F, rejectMove },
    ],
    k: [],
    K: [],
    P: [
      {
        step: top,
        shallStop: (count: number, _: any, start: Coordinates) => {
          if (start.y < 6 && count >= 1) return true;
          if (start.y === 6 && count >= 2) return true;
        },
        rejectMove,
      },
      {
        step: bottomLeft,
        shallStop: stopIfOpponent,
        flags: flags.capture,
        rejectMove,
      },
      {
        step: ({ x, y }: Coordinates): Coordinates => ({ x: x - 1, y: y - 1 }),
        shallStop: stopIfOpponent,
        flags: flags.capture,
        rejectMove,
      },
    ],
  };
}
