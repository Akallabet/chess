import { flags } from '../constants.js';
import { Coordinates, MoveState } from '../types.js';

import { anyCellUnderCheck, isCellUnderCheck } from './is-cell-under-check.js';
import { getCastlingRights } from '../fen/index.js';
import {
  areOpponents,
  anyCellOccupied,
  isCellOccupied,
  getPieceColor,
  getPieceCoord,
  getKingPiece,
} from '../utils/index.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { errorCodes } from 'src/error-codes.js';

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
    areOpponents(
      state.board[y][x].piece as string,
      state.board[origin.y][origin.x].piece as string
    )
  )
    return false;
  return true;
};

const shouldKingStop = ({ step, current, origin, state }: MoveState): boolean =>
  step > 0 ||
  isCellUnderCheck(
    state,
    getPieceColor(state.board[origin.y][origin.x].piece as string),
    current
  );

const kingsideCastlingMove =
  (startRow: number) =>
  ({ step, current, origin, state }: MoveState): boolean => {
    if (step === 0)
      return isCellUnderCheck(
        state,
        getPieceColor(state.board[origin.y][origin.x].piece as string),
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
          getPieceColor(state.board[origin.y][origin.x].piece as string),
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
        getPieceColor(state.board[origin.y][origin.x].piece as string),
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
          getPieceColor(state.board[origin.y][origin.x].piece as string),
          [current, { y: current.y, x: current.x - 1 }]
        ) ||
        anyCellOccupied(state, [current, { y: current.y, x: current.x - 1 }])
      );
    }
    return true;
  };

interface BasePattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: MoveState) => boolean;
  flag?: string;
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
    },
    {
      advance: bottomght,
      shallStop: stopIfOpponent,
      flag: flags.capture,
    },
    {
      advance: topght,
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
    { advance: topght, shallStop: F },
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
    { advance: topght, shallStop: F },
    { advance: topLeft, shallStop: F },
    { advance: bottomLeft, shallStop: F },
  ],
  k: [
    { advance: right, shallStop: kingsideCastlingMove(0) },
    { advance: left, shallStop: queensideCastlingMove(0) },
    { advance: top, shallStop: shouldKingStop },
    { advance: bottom, shallStop: shouldKingStop },
    { advance: bottomght, shallStop: shouldKingStop },
    { advance: topght, shallStop: shouldKingStop },
    { advance: topLeft, shallStop: shouldKingStop },
    { advance: bottomLeft, shallStop: shouldKingStop },
  ],
  K: [
    { advance: right, shallStop: kingsideCastlingMove(7) },
    { advance: left, shallStop: queensideCastlingMove(7) },

    { advance: top, shallStop: shouldKingStop },
    { advance: bottom, shallStop: shouldKingStop },
    { advance: bottomght, shallStop: shouldKingStop },
    { advance: topght, shallStop: shouldKingStop },
    { advance: topLeft, shallStop: shouldKingStop },
    { advance: bottomLeft, shallStop: shouldKingStop },
  ],
};
const isKingUnderAttack = ({
  origin,
  state,
  current: target,
}: MoveState): boolean => {
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
    p: basePatterns.p.map(addProp('rejectMove', isKingUnderAttack)),
    P: basePatterns.P.map(addProp('rejectMove', isKingUnderAttack)),
    r: basePatterns.r.map(addProp('rejectMove', isKingUnderAttack)),
    R: basePatterns.r.map(addProp('rejectMove', isKingUnderAttack)),
    b: basePatterns.b.map(addProp('rejectMove', isKingUnderAttack)),
    B: basePatterns.b.map(addProp('rejectMove', isKingUnderAttack)),
    n: basePatterns.n.map(addProp('rejectMove', isKingUnderAttack)),
    N: basePatterns.n.map(addProp('rejectMove', isKingUnderAttack)),
    q: basePatterns.q.map(addProp('rejectMove', isKingUnderAttack)),
    Q: basePatterns.q.map(addProp('rejectMove', isKingUnderAttack)),
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
