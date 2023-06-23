import { flags } from '../constants.js';
import { Coordinates, InternalState } from '../types.js';

import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';
import { getCastlingRights } from '../fen.js';
import { areOpponents } from '../utils.js';

interface PatternState {
  step: number;
  target: Coordinates;
  origin: Coordinates;
  state: InternalState;
}

const F = () => false;

const lte =
  (n: number) =>
  ({ step }: PatternState) => {
    return n <= step;
  };

const topLeft = ({ x, y }: Coordinates): Coordinates => ({
  x: x - 1,
  y: y - 1,
});
const topRight = ({ x, y }: Coordinates): Coordinates => ({
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
  target: { x, y },
  origin,
  state,
}: PatternState): boolean => {
  if (
    state.board[y][x].piece &&
    areOpponents(
      state.board[y][x].piece as string,
      state.board[origin.y][origin.x].piece as string
    )
  )
    return false;
  return true;
};

// const shouldKingStop = ({
//   step,
//   target,
//   origin,
//   state,
// }: MoveState): boolean => {
//   // console.log('should king stop', step, target, origin, state.board);
//   return (
//     step > 0 ||
//     isCellUnderCheck(
//       state,
//       getPieceColor(state.board[origin.y][origin.x].piece as string),
//       target
//     )
//   );
// };

// const kingsideCastlingMove =
//   (startRow: number) =>
//   ({ step, target, origin, state }: PatternState): boolean => {
// console.log('kingside castling move');
// if (step === 0) {
//   const moveState = moveAndUpdateState(origin, target, state);
//   const isKingUnderCheck = isCellUnderCheck(
//     moveState,
//     state.activeColor,
//     target
//   );
//   console.log('is king under check', isKingUnderCheck);
//   return isKingUnderCheck;
// }
// if (step === 1 && target.y === startRow) {
//   const hasCastlingRights = getCastlingRights(
//     state.board[origin.y][origin.x].piece || '',
//     state
//   );
//   if (!hasCastlingRights.kingSide) return true;
//   const moveState = moveAndUpdateState(origin, target, state);
//   return (
//     isCellOccupied(state, target) ||
//     isCellUnderCheck(moveState, state.activeColor, target)
//   );
// }
// return true;
// };

// const queensideCastlingMove =
//   (startRow: number) =>
//   ({ step, target, origin, state }: PatternState): boolean => {
// console.log('is queenside castling');
// if (step === 0)
//   return isCellUnderCheck(
//     state,
//     getPieceColor(state.board[origin.y][origin.x].piece as string),
//     target
//   );
// if (step === 1 && target.y === startRow) {
//   const hasCastlingghts = getCastlingRights(
//     state.board[origin.y][origin.x].piece || '',
//     state
//   );
//   if (!hasCastlingghts.queenSide) return true;
//   return (
//     anyCellUnderCheck(
//       state,
//       getPieceColor(state.board[origin.y][origin.x].piece as string),
//       [target, { y: target.y, x: target.x - 1 }]
//     ) || anyCellOccupied(state, [target, { y: target.y, x: target.x - 1 }])
//   );
// }
// return true;
// };

export interface Pattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: PatternState) => boolean;
  flag?: string;
  limit?: number;
}

const basePatterns: Record<string, Array<Pattern>> = {
  p: [
    {
      advance: bottom,
      shallStop: ({ step, origin }: PatternState) => {
        if (origin.y > 1 && step >= 1) return true;
        if (origin.y === 1 && step >= 2) return true;
        return false;
      },
      limit: 1,
    },
    {
      advance: bottomght,
      shallStop: stopIfOpponent,
      flag: flags.capture,
    },
    {
      advance: topRight,
      shallStop: stopIfOpponent,
      flag: flags.capture,
    },
  ],
  P: [
    {
      advance: top,
      shallStop: ({ step, origin }: PatternState) => {
        if (origin.y < 6 && step >= 1) return true;
        if (origin.y === 6 && step >= 2) return true;
        return false;
      },
    },
    {
      advance: bottomLeft,
      shallStop: stopIfOpponent,
      flag: flags.capture,
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x - 1,
        y: y - 1,
      }),
      shallStop: stopIfOpponent,
      flag: flags.capture,
    },
  ],
  n: [
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x + 2,
        y: y + 1,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x + 1,
        y: y + 2,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x - 1,
        y: y + 2,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x - 2,
        y: y + 1,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x - 2,
        y: y - 1,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x - 1,
        y: y - 2,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x + 1,
        y: y - 2,
      }),
      shallStop: lte(1),
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => ({
        x: x + 2,
        y: y - 1,
      }),
      shallStop: lte(1),
    },
  ],
  b: [
    { advance: bottomght, shallStop: F },
    { advance: topRight, shallStop: F },
    { advance: topLeft, shallStop: F },
    { advance: bottomLeft, shallStop: F },
  ],
  r: [
    { advance: right, shallStop: F },
    { advance: left, shallStop: F },
    { advance: top, shallStop: F },
    { advance: bottom, shallStop: F },
  ],
  q: [
    { advance: right, shallStop: F },
    { advance: left, shallStop: F },
    { advance: top, shallStop: F },
    { advance: bottom, shallStop: F },
    { advance: bottomght, shallStop: F },
    { advance: topRight, shallStop: F },
    { advance: topLeft, shallStop: F },
    { advance: bottomLeft, shallStop: F },
  ],
  k: [
    // { advance: right, shallStop: kingsideCastlingMove(0) },
    // { advance: left, shallStop: queensideCastlingMove(0) },
    { advance: right, shallStop: lte(1) },
    { advance: left, shallStop: lte(1) },
    { advance: top, shallStop: lte(1) },
    { advance: bottom, shallStop: lte(1) },
    { advance: bottomght, shallStop: lte(1) },
    { advance: topRight, shallStop: lte(1) },
    { advance: topLeft, shallStop: lte(1) },
    { advance: bottomLeft, shallStop: lte(1) },
  ],
  K: [
    // { advance: right, shallStop: kingsideCastlingMove(7) },
    // { advance: left, shallStop: queensideCastlingMove(7) },
    { advance: right, shallStop: lte(1) },
    { advance: left, shallStop: lte(1) },
    { advance: top, shallStop: lte(1) },
    { advance: bottom, shallStop: lte(1) },
    { advance: bottomght, shallStop: lte(1) },
    { advance: topRight, shallStop: lte(1) },
    { advance: topLeft, shallStop: lte(1) },
    { advance: bottomLeft, shallStop: lte(1) },
  ],
};

const identity = <T>(x: T): T => x;

export const patterns: Record<string, Array<Pattern>> = {
  p: basePatterns.p.map(identity),
  P: basePatterns.P.map(identity),
  r: basePatterns.r.map(identity),
  R: basePatterns.r.map(identity),
  b: basePatterns.b.map(identity),
  B: basePatterns.b.map(identity),
  n: basePatterns.n.map(identity),
  N: basePatterns.n.map(identity),
  q: basePatterns.q.map(identity),
  Q: basePatterns.q.map(identity),
  k: basePatterns.k.map(identity),
  K: basePatterns.K.map(identity),
};
