import { flags } from '../constants.js';
import { Coordinates, InternalState } from '../types.js';

import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';
import { getCastlingRights } from '../fen.js';
import {
  areOpponents,
  anyCellOccupied,
  isCellOccupied,
  getPieceColor,
  getPieceCoord,
  getKingPiece,
} from '../utils.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { errorCodes } from '../error-codes.js';

interface MoveState {
  step: number;
  target: Coordinates;
  origin: Coordinates;
  state: InternalState;
}

const addProp =
  <T, K extends string>(prop: K, value: T) =>
  <U>(obj: U): U & Record<K, T> =>
    ({
      ...obj,
      [prop]: value,
    } as U & Record<K, T>);

const identity = <T>(x: T): T => x;

const F = () => false;

const lte =
  (n: number) =>
  ({ step }: MoveState) => {
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
}: MoveState): boolean => {
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

const kingsideCastlingMove =
  (startRow: number) =>
  ({ step, target, origin, state }: MoveState): boolean => {
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
  };

const queensideCastlingMove =
  (startRow: number) =>
  ({ step, target, origin, state }: MoveState): boolean => {
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
  };

interface BasePattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: MoveState) => boolean;
  flag?: string;
  limit?: number;
}

export interface Pattern extends BasePattern {
  rejectMove: (args: MoveState) => boolean;
}

const basePatterns: Record<string, Array<BasePattern>> = {
  p: [
    {
      advance: bottom,
      shallStop: ({ step, origin }: MoveState) => {
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
      shallStop: ({ step, origin }: MoveState) => {
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
const isOwnKingUnderCheck = ({ origin, state, target }: MoveState): boolean => {
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  const moveState = moveAndUpdateState(origin, target, state);
  const pieceColor = getPieceColor(
    moveState.board[kingCoord.y][kingCoord.x].piece as string
  );
  const isUnderCheck = isCellUnderCheck(moveState, pieceColor, kingCoord);
  return isUnderCheck;
};

export const patterns: Record<string, Record<string, Array<Pattern>>> = {
  standard: {
    p: basePatterns.p.map(addProp('rejectMove', isOwnKingUnderCheck)),
    P: basePatterns.P.map(addProp('rejectMove', isOwnKingUnderCheck)),
    r: basePatterns.r.map(addProp('rejectMove', isOwnKingUnderCheck)),
    R: basePatterns.r.map(addProp('rejectMove', isOwnKingUnderCheck)),
    b: basePatterns.b.map(addProp('rejectMove', isOwnKingUnderCheck)),
    B: basePatterns.b.map(addProp('rejectMove', isOwnKingUnderCheck)),
    n: basePatterns.n.map(addProp('rejectMove', isOwnKingUnderCheck)),
    N: basePatterns.n.map(addProp('rejectMove', isOwnKingUnderCheck)),
    q: basePatterns.q.map(addProp('rejectMove', isOwnKingUnderCheck)),
    Q: basePatterns.q.map(addProp('rejectMove', isOwnKingUnderCheck)),
    k: basePatterns.k.map(addProp('rejectMove', F)),
    K: basePatterns.K.map(addProp('rejectMove', F)),
  },
  demo: {
    p: basePatterns.p.map(addProp('rejectMove', F)),
    P: basePatterns.P.map(addProp('rejectMove', F)),
    r: basePatterns.r.map(addProp('rejectMove', F)),
    R: basePatterns.r.map(addProp('rejectMove', F)),
    b: basePatterns.b.map(addProp('rejectMove', F)),
    B: basePatterns.b.map(addProp('rejectMove', F)),
    n: basePatterns.n.map(addProp('rejectMove', F)),
    N: basePatterns.n.map(addProp('rejectMove', F)),
    q: basePatterns.q.map(addProp('rejectMove', F)),
    Q: basePatterns.q.map(addProp('rejectMove', F)),
    k: basePatterns.k.map(addProp('rejectMove', F)),
    K: basePatterns.K.map(addProp('rejectMove', F)),
  },
};

export const patternsCheck: Record<string, Record<string, Array<Pattern>>> = {
  standard: {
    p: patterns.demo.p.map(identity),
    P: patterns.demo.P.map(identity),
    r: patterns.demo.r.map(identity),
    R: patterns.demo.r.map(identity),
    b: patterns.demo.b.map(identity),
    B: patterns.demo.b.map(identity),
    n: patterns.demo.n.map(identity),
    N: patterns.demo.n.map(identity),
    q: patterns.demo.q.map(identity),
    Q: patterns.demo.q.map(identity),
    k: patterns.standard.k.map(addProp('shallStop', lte(1))),
    K: patterns.standard.K.map(addProp('shallStop', lte(1))),
  },
  demo: {
    p: patterns.demo.p.map(identity),
    P: patterns.demo.P.map(identity),
    r: patterns.demo.r.map(identity),
    R: patterns.demo.r.map(identity),
    b: patterns.demo.b.map(identity),
    B: patterns.demo.b.map(identity),
    n: patterns.demo.n.map(identity),
    N: patterns.demo.n.map(identity),
    q: patterns.demo.q.map(identity),
    Q: patterns.demo.q.map(identity),
    k: patterns.standard.k.map(addProp('shallStop', lte(1))),
    K: patterns.standard.K.map(addProp('shallStop', lte(1))),
  },
};
