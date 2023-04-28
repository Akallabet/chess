import { flags, modesList } from '../constants.js';
import { Coordinates, InternalState, MoveState } from '../types.js';

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

const lte =
  (n: number) =>
  ({ step }: MoveState) =>
    step <= n;

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

const stopIfOpponent = ({
  current: { x, y },
  origin,
  state,
}: MoveState): boolean => {
  if (
    state.board[y][x].piece &&
    areOpponents(state.board[y][x].piece, state.board[origin.y][origin.x].piece)
  )
    return false;
  return true;
};

const shouldKingStop = ({ step, current, origin, state }: MoveState): boolean =>
  step > 0 ||
  isCellUnderCheck(
    state,
    getPieceColor(state.board[origin.y][origin.x].piece),
    current
  );

const kingsideCastlingMove =
  (startRow: number) =>
  ({ step, current, origin, state }: MoveState): boolean => {
    if (step === 0)
      return isCellUnderCheck(
        state,
        getPieceColor(state.board[origin.y][origin.x].piece),
        current
      );
    if (step === 1 && current.y === startRow) {
      const hasCastlingRights = getCastlingRights(
        state.board[origin.y][origin.x].piece || '',
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
const queensideCastlingMove =
  (startRow: number) =>
  ({ step, current, origin, state }: MoveState): boolean => {
    if (step === 0)
      return isCellUnderCheck(
        state,
        getPieceColor(state.board[origin.y][origin.x].piece),
        current
      );
    if (step === 1 && current.y === startRow) {
      const hasCastlingghts = getCastlingRights(
        state.board[origin.y][origin.x].piece || '',
        state
      );
      if (!hasCastlingghts.queenSide) return true;
      return (
        anyCellUnderCheck(
          state,
          getPieceColor(state.board[origin.y][origin.x].piece),
          [current, { y: current.y, x: current.x - 1 }]
        ) ||
        anyCellOccupied(state, [current, { y: current.y, x: current.x - 1 }])
      );
    }
    return true;
  };

export interface Pattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: MoveState) => boolean;
  flag?: string;
  rejectMove: (args: MoveState) => boolean;
}

type PiecesPatterns = Record<string, Array<Pattern>>;

export function getPatternsForLegalMoves(state: InternalState): PiecesPatterns {
  const { rejectMove } = modesMap[state.mode || modesList[0]];

  const kingMoves = [
    { advance: top, shallStop: shouldKingStop, rejectMove: F },
    { advance: bottom, shallStop: shouldKingStop, rejectMove: F },
    { advance: bottomght, shallStop: shouldKingStop, rejectMove: F },
    { advance: topght, shallStop: shouldKingStop, rejectMove: F },
    { advance: topLeft, shallStop: shouldKingStop, rejectMove: F },
    { advance: bottomLeft, shallStop: shouldKingStop, rejectMove: F },
  ];
  const patterns = getPatterns(rejectMove);
  patterns.k = kingMoves.concat([
    { advance: right, shallStop: kingsideCastlingMove(0), rejectMove: F },
    { advance: left, shallStop: queensideCastlingMove(0), rejectMove: F },
  ]);
  patterns.K = kingMoves.concat([
    { advance: right, shallStop: kingsideCastlingMove(7), rejectMove: F },
    { advance: left, shallStop: queensideCastlingMove(7), rejectMove: F },
  ]);
  return patterns;
}

export function getPatternsForMoves(): PiecesPatterns {
  const kingMoves = [
    { advance: right, shallStop: lte(1), rejectMove: F },
    { advance: left, shallStop: lte(1), rejectMove: F },
    { advance: top, shallStop: lte(1), rejectMove: F },
    { advance: bottom, shallStop: lte(1), rejectMove: F },
    { advance: bottomght, shallStop: lte(1), rejectMove: F },
    { advance: topght, shallStop: lte(1), rejectMove: F },
    { advance: topLeft, shallStop: lte(1), rejectMove: F },
    { advance: bottomLeft, shallStop: lte(1), rejectMove: F },
  ];

  const patterns = getPatterns(() => false);
  patterns.k = kingMoves;
  patterns.K = kingMoves;

  return patterns;
}

export function getPatterns(
  rejectMove: (args: MoveState) => boolean
): PiecesPatterns {
  return {
    p: [
      {
        advance: bottom,
        shallStop: ({ step, origin }: MoveState) => {
          if (origin.y > 1 && step >= 1) return true;
          if (origin.y === 1 && step >= 2) return true;
          return false;
        },
        rejectMove,
      },
      {
        advance: bottomght,
        shallStop: stopIfOpponent,
        flag: flags.capture,
        rejectMove,
      },
      {
        advance: topght,
        shallStop: stopIfOpponent,
        flag: flags.capture,
        rejectMove,
      },
    ],
    n: [
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x + 2,
          y: y + 1,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x + 1,
          y: y + 2,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x - 1,
          y: y + 2,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x - 2,
          y: y + 1,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x - 2,
          y: y - 1,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x - 1,
          y: y - 2,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x + 1,
          y: y - 2,
        }),
        shallStop: lte(1),
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x + 2,
          y: y - 1,
        }),
        shallStop: lte(1),
        rejectMove,
      },
    ],
    b: [
      { advance: bottomght, shallStop: F, rejectMove },
      { advance: topght, shallStop: F, rejectMove },
      { advance: topLeft, shallStop: F, rejectMove },
      { advance: bottomLeft, shallStop: F, rejectMove },
    ],
    r: [
      { advance: right, shallStop: F, rejectMove },
      { advance: left, shallStop: F, rejectMove },
      { advance: top, shallStop: F, rejectMove },
      { advance: bottom, shallStop: F, rejectMove },
    ],
    q: [
      { advance: right, shallStop: F, rejectMove },
      { advance: left, shallStop: F, rejectMove },
      { advance: top, shallStop: F, rejectMove },
      { advance: bottom, shallStop: F, rejectMove },
      { advance: bottomght, shallStop: F, rejectMove },
      { advance: topght, shallStop: F, rejectMove },
      { advance: topLeft, shallStop: F, rejectMove },
      { advance: bottomLeft, shallStop: F, rejectMove },
    ],
    k: [],
    K: [],
    P: [
      {
        advance: top,
        shallStop: ({ step, origin }: MoveState) => {
          if (origin.y < 6 && step >= 1) return true;
          if (origin.y === 6 && step >= 2) return true;
          return false;
        },
        rejectMove,
      },
      {
        advance: bottomLeft,
        shallStop: stopIfOpponent,
        flag: flags.capture,
        rejectMove,
      },
      {
        advance: ({ x, y }: Coordinates): Coordinates => ({
          x: x - 1,
          y: y - 1,
        }),
        shallStop: stopIfOpponent,
        flag: flags.capture,
        rejectMove,
      },
    ],
  };
}
