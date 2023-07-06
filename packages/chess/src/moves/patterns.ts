import { flags } from '../constants.js';
import { Coordinates, InternalState } from '../types.js';

import { isCellUnderCheck } from './is-cell-under-check.js';
import { getCastlingRights } from '../fen.js';
import { areOpponents, getOpponentColor } from '../utils.js';

interface PatternState {
  step: number;
  target: Coordinates;
  origin: Coordinates;
  state: InternalState;
}

const F = () => false;

const lte =
  (n: number) =>
  ({ step }: { step: number }) => {
    return n <= step;
  };

const topLeft = ({ x, y }: Coordinates): Coordinates => ({
  y: y - 1,
  x: x - 1,
});
const topRight = ({ x, y }: Coordinates): Coordinates => ({
  y: y - 1,
  x: x + 1,
});
const bottomLeft = ({ x, y }: Coordinates): Coordinates => ({
  y: y + 1,
  x: x - 1,
});
const bottomRight = ({ x, y }: Coordinates): Coordinates => ({
  y: y + 1,
  x: x + 1,
});

const top = ({ y, x }: Coordinates): Coordinates => ({ y: y - 1, x });
const bottom = ({ y, x }: Coordinates): Coordinates => ({ y: y + 1, x });
const right = ({ y, x }: Coordinates): Coordinates => ({ y, x: x + 1 });
const left = ({ y, x }: Coordinates): Coordinates => ({ y, x: x - 1 });

const stopIfOpponent = ({
  target: { x, y },
  origin,
  state,
}: PatternState): boolean => {
  if (!state.board[y][x].piece) return false;
  return areOpponents(
    state.board[y][x].piece as string,
    state.board[origin.y][origin.x].piece as string
  );
};

const stopIfNotOpponent = ({
  target: { x, y },
  origin,
  state,
}: PatternState): boolean => {
  if (!state.board[y][x].piece) return true;
  return !areOpponents(
    state.board[y][x].piece as string,
    state.board[origin.y][origin.x].piece as string
  );
};

export interface Pattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: PatternState) => boolean;
  addFlags?: (args: PatternState) => Record<string, boolean>;
  recursive?: boolean;
}

const basePatterns: Record<string, Array<Pattern>> = {
  p: [
    {
      advance: bottom,
      shallStop: ({ step, origin, target, state }: PatternState) => {
        if (origin.y > 1 && step >= 1) return true;
        if (origin.y === 1 && step >= 2) return true;
        return stopIfOpponent({ step, origin, target, state });
      },
      addFlags: ({ target }) => ({
        [flags.move]: true,
        ...(target.y === 7 ? { [flags.promotion]: true } : {}),
      }),
    },
    {
      advance: bottomRight,
      shallStop: stopIfNotOpponent,
      addFlags: ({ target }) => ({
        [flags.capture]: true,
        ...(target.y === 7 ? { [flags.promotion]: true } : {}),
      }),
    },
    {
      advance: bottomLeft,
      shallStop: stopIfNotOpponent,
      addFlags: ({ target }) => ({
        [flags.capture]: true,
        ...(target.y === 7 ? { [flags.promotion]: true } : {}),
      }),
    },
  ],
  P: [
    {
      advance: top,
      shallStop: ({ step, origin, target, state }: PatternState) => {
        if (origin.y < 6 && step >= 1) return true;
        if (origin.y === 6 && step >= 2) return true;
        return stopIfOpponent({ step, origin, target, state });
      },
      addFlags: ({ target }) => ({
        [flags.move]: true,
        ...(target.y === 0 ? { [flags.promotion]: true } : {}),
      }),
    },
    {
      advance: topRight,
      shallStop: stopIfNotOpponent,
      addFlags: ({ target }) => ({
        [flags.capture]: true,
        ...(target.y === 0 ? { [flags.promotion]: true } : {}),
      }),
    },
    {
      advance: topLeft,
      shallStop: stopIfNotOpponent,
      addFlags: ({ target }) => ({
        [flags.capture]: true,
        ...(target.y === 0 ? { [flags.promotion]: true } : {}),
      }),
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
    { advance: bottomRight, shallStop: F },
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
    { advance: bottomRight, shallStop: F },
    { advance: topRight, shallStop: F },
    { advance: topLeft, shallStop: F },
    { advance: bottomLeft, shallStop: F },
  ],
  k: [
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x + 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!getCastlingRights('k', state).kingSide) return true;
        if (origin.y !== 0 && origin.x !== 3) return true;
        if (lte(1)({ step })) return true;
        const castlingEmptyCells = [
          { x: origin.x + 1, y: origin.y },
          { x: origin.x + 2, y: origin.y },
        ];
        const castlingCells = [origin, ...castlingEmptyCells, target];
        return (
          castlingCells.some(target =>
            isCellUnderCheck(state, target, getOpponentColor(state.activeColor))
          ) ||
          castlingEmptyCells.some(coord => state.board[coord.y][coord.x].piece)
        );
      },
      recursive: true,
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x - 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!getCastlingRights('k', state).queenSide) return true;
        if (origin.y !== 0 && origin.x !== 3) return true;
        if (lte(1)({ step })) return true;
        const castlingEmptyCells = [
          { x: origin.x - 1, y: origin.y },
          { x: origin.x - 2, y: origin.y },
          { x: origin.x - 3, y: origin.y },
        ];
        const castlingCells = [origin, ...castlingEmptyCells, target];
        return (
          castlingCells.some(target =>
            isCellUnderCheck(state, target, getOpponentColor(state.activeColor))
          ) ||
          castlingEmptyCells.some(coord => state.board[coord.y][coord.x].piece)
        );
      },
      recursive: true,
    },
    { advance: right, shallStop: lte(1) },
    { advance: left, shallStop: lte(1) },
    { advance: top, shallStop: lte(1) },
    { advance: bottom, shallStop: lte(1) },
    { advance: bottomRight, shallStop: lte(1) },
    { advance: topRight, shallStop: lte(1) },
    { advance: topLeft, shallStop: lte(1) },
    { advance: bottomLeft, shallStop: lte(1) },
  ],
  K: [
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x + 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!getCastlingRights('K', state).kingSide) return true;
        if (origin.y !== state.board.length - 1 && origin.x !== 3) return true;
        if (lte(1)({ step })) return true;
        const castlingEmptyCells = [
          { x: origin.x + 1, y: origin.y },
          { x: origin.x + 2, y: origin.y },
        ];
        const castlingCells = [origin, ...castlingEmptyCells, target];
        return (
          castlingCells.some(target =>
            isCellUnderCheck(state, target, getOpponentColor(state.activeColor))
          ) ||
          castlingEmptyCells.some(coord => state.board[coord.y][coord.x].piece)
        );
      },
      recursive: true,
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x - 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!getCastlingRights('K', state).queenSide) return true;
        if (origin.y !== state.board.length - 1 && origin.x !== 3) return true;
        if (lte(1)({ step })) return true;
        const castlingEmptyCells = [
          { x: origin.x - 1, y: origin.y },
          { x: origin.x - 2, y: origin.y },
          { x: origin.x - 3, y: origin.y },
        ];
        const castlingCells = [origin, ...castlingEmptyCells, target];
        return (
          castlingCells.some(target =>
            isCellUnderCheck(state, target, getOpponentColor(state.activeColor))
          ) ||
          castlingEmptyCells.some(coord => state.board[coord.y][coord.x].piece)
        );
      },
      recursive: true,
    },
    { advance: right, shallStop: lte(1) },
    { advance: left, shallStop: lte(1) },
    { advance: top, shallStop: lte(1) },
    { advance: bottom, shallStop: lte(1) },
    { advance: bottomRight, shallStop: lte(1) },
    { advance: topRight, shallStop: lte(1) },
    { advance: topLeft, shallStop: lte(1) },
    { advance: bottomLeft, shallStop: lte(1) },
  ],
};

export const patterns: Record<string, Array<Pattern>> = {
  p: basePatterns.p,
  P: basePatterns.P,
  r: basePatterns.r,
  R: basePatterns.r,
  b: basePatterns.b,
  B: basePatterns.b,
  n: basePatterns.n,
  N: basePatterns.n,
  q: basePatterns.q,
  Q: basePatterns.q,
  k: basePatterns.k,
  K: basePatterns.K,
};
