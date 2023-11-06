import { blackPieces, flags, whitePieces } from '../constants.js';
import { Coordinates, FENState, Flags, Piece } from '../types.js';

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

function jumpTo(args: Coordinates) {
  return function ({ x, y }: Coordinates): Coordinates {
    return { x: x + args.x, y: y + args.y };
  };
}

const topLeft = jumpTo({ x: -1, y: -1 });
const topRight = jumpTo({ x: 1, y: -1 });
const bottomLeft = jumpTo({ x: -1, y: 1 });
const bottomRight = jumpTo({ x: 1, y: 1 });
const top = jumpTo({ x: 0, y: -1 });
const bottom = jumpTo({ x: 0, y: 1 });
const right = jumpTo({ x: 1, y: 0 });
const left = jumpTo({ x: -1, y: 0 });

function stopIfOpponent({ target, origin, state }: PatternState): boolean {
  return (
    !!state.board[target.y][target.x] &&
    areOpponents(
      state.board[target.y][target.x] as Piece,
      state.board[origin.y][origin.x] as Piece
    )
  );
}

function stopIfEmpty({ target, state }: PatternState): boolean {
  return (
    (!state.enPassant && !state.board[target.y][target.x]) ||
    (state.enPassant &&
      !state.board[target.y][target.x] &&
      (target.x !== state.enPassant.x || target.y !== state.enPassant.y))
  );
}

export interface Pattern {
  advance: (args: Coordinates) => Coordinates;
  shallStop: (args: PatternState) => boolean;
  addFlags?: (args: PatternState) => Flags;
  recursive?: boolean;
}

export const patterns: Record<string, Array<Pattern>> = {
  p: [
    {
      advance: bottom,
      shallStop: ({ step, origin, target, state }: PatternState) => {
        if (origin.y > 1 && step >= 1) return true;
        if (origin.y === 1 && step >= 2) return true;
        return stopIfOpponent({ step, origin, target, state });
      },
      addFlags: ({ target }) => ({
        ...(target.y === 7
          ? {
              [flags.promotion]: [
                blackPieces.rook,
                blackPieces.bishop,
                blackPieces.knight,
                blackPieces.queen,
              ],
            }
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
          ? {
              [flags.promotion]: [
                blackPieces.rook,
                blackPieces.bishop,
                blackPieces.knight,
                blackPieces.queen,
              ],
            }
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
          ? {
              [flags.promotion]: [
                blackPieces.rook,
                blackPieces.bishop,
                blackPieces.knight,
                blackPieces.queen,
              ],
            }
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
        ...(target.y === 0
          ? {
              [flags.promotion]: [
                whitePieces.rook,
                whitePieces.bishop,
                whitePieces.knight,
                whitePieces.queen,
              ],
            }
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
          ? {
              [flags.promotion]: [
                whitePieces.rook,
                whitePieces.bishop,
                whitePieces.knight,
                whitePieces.queen,
              ],
            }
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
          ? {
              [flags.promotion]: [
                whitePieces.rook,
                whitePieces.bishop,
                whitePieces.knight,
                whitePieces.queen,
              ],
            }
          : {}),
      }),
    },
  ],
  n: [
    {
      advance: jumpTo({ x: 2, y: 1 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: 1, y: 2 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: -1, y: 2 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: -2, y: 1 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: -2, y: -1 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: -1, y: -2 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: 1, y: -2 }),
      shallStop: lte(1),
    },
    {
      advance: jumpTo({ x: 2, y: -1 }),
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
          ) || castlingEmptyCells.some(coord => state.board[coord.y][coord.x])
        );
      },
      addFlags: () => ({
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
          ) || castlingEmptyCells.some(coord => state.board[coord.y][coord.x])
        );
      },
      addFlags: () => ({
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
          ) || castlingEmptyCells.some(coord => state.board[coord.y][coord.x])
        );
      },
      addFlags: () => ({
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
          ) || castlingEmptyCells.some(coord => state.board[coord.y][coord.x])
        );
      },
      addFlags: () => ({
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
