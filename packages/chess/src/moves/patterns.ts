import { blackPieces, flags, whitePieces } from '../constants.js';
import { Coordinates, FENState, Flags } from '../types.js';

import { isCellUnderCheck } from './is-cell-under-check.js';
import { areOpponents, getOpponentColor } from '../utils.js';

interface PatternState {
  step: number;
  target: Coordinates;
  origin: Coordinates;
  state: FENState;
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

function stopIfOpponent({ target, origin, state }: PatternState): boolean {
  return (
    !!state.board[target.y][target.x].piece &&
    areOpponents(
      state.board[target.y][target.x].piece as string,
      state.board[origin.y][origin.x].piece as string
    )
  );
}

function stopIfEmpty({ target, state }: PatternState): boolean {
  return (
    (!state.enPassant && !state.board[target.y][target.x].piece) ||
    (state.enPassant &&
      !state.board[target.y][target.x].piece &&
      (target.x !== state.enPassant.x || target.y !== state.enPassant.y))
  );
}

export interface Pattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: PatternState) => boolean;
  addFlags?: (args: PatternState) => Flags;
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
        ...(target.y === 7
          ? { [flags.promotion]: blackPieces.replace('k', '') }
          : {}),
      }),
    },
    {
      advance: bottomRight,
      shallStop: stopIfEmpty,
      addFlags: ({ target, state }) => ({
        [flags.capture]: true,
        ...(state.enPassant &&
        target.x === state.enPassant.x &&
        target.y === state.enPassant.y
          ? {
              [flags.enPassant]: {
                y: state.enPassant.y - 1,
                x: state.enPassant.x,
              },
            }
          : {}),
        ...(target.y === 7
          ? { [flags.promotion]: blackPieces.replace('k', '').replace('p', '') }
          : {}),
      }),
    },
    {
      advance: bottomLeft,
      shallStop: stopIfEmpty,
      addFlags: ({ target, state }) => ({
        [flags.capture]: true,
        ...(state.enPassant &&
        target.x === state.enPassant.x &&
        target.y === state.enPassant.y
          ? {
              [flags.enPassant]: {
                y: state.enPassant.y - 1,
                x: state.enPassant.x,
              },
            }
          : {}),
        ...(target.y === 7
          ? { [flags.promotion]: blackPieces.replace('k', '').replace('p', '') }
          : {}),
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
        ...(target.y === 0
          ? { [flags.promotion]: whitePieces.replace('K', '').replace('P', '') }
          : {}),
      }),
    },
    {
      advance: topRight,
      shallStop: stopIfEmpty,
      addFlags: ({ target, state }) => ({
        [flags.capture]: true,
        ...(state.enPassant &&
        target.x === state.enPassant.x &&
        target.y === state.enPassant.y
          ? {
              [flags.enPassant]: {
                y: state.enPassant.y + 1,
                x: state.enPassant.x,
              },
            }
          : {}),
        ...(target.y === 0
          ? { [flags.promotion]: whitePieces.replace('K', '').replace('P', '') }
          : {}),
      }),
    },
    {
      advance: topLeft,
      shallStop: stopIfEmpty,
      addFlags: ({ target, state }) => ({
        [flags.capture]: true,
        ...(state.enPassant &&
        target.x === state.enPassant.x &&
        target.y === state.enPassant.y
          ? {
              [flags.enPassant]: {
                y: state.enPassant.y + 1,
                x: state.enPassant.x,
              },
            }
          : {}),
        ...(target.y === 0
          ? { [flags.promotion]: whitePieces.replace('K', '').replace('P', '') }
          : {}),
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
        if (!state.castlingRights.b.kingSide) return true;
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
      addFlags: () => ({
        [flags.move]: true,
        [flags.kingSideCastling]: true,
      }),
      recursive: true,
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x - 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!state.castlingRights.b.queenSide) return true;
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
      addFlags: () => ({
        [flags.move]: true,
        [flags.queenSideCastling]: true,
      }),
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
        if (!state.castlingRights.w.kingSide) return true;
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
      addFlags: () => ({
        [flags.move]: true,
        [flags.kingSideCastling]: true,
      }),
      recursive: true,
    },
    {
      advance: ({ x, y }: Coordinates): Coordinates => {
        return { x: x - 2, y };
      },
      shallStop: ({ step, state, origin, target }) => {
        if (!state.castlingRights.w.queenSide) return true;
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
      addFlags: () => ({
        [flags.move]: true,
        [flags.queenSideCastling]: true,
      }),

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
