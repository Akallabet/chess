import { flags, modes } from '../constants.js';
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
import { errorCodes } from 'src/error-codes.js';
import { moveAndUpdateState } from 'src/move.js';

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

// type PiecesPatterns = Record<string, Array<Pattern>>;
//
// export function getPatternsForLegalMoves(
//   rejectMove: (args: MoveState) => boolean
// ): PiecesPatterns {
//   const kingMoves = [
//     { advance: top, shallStop: shouldKingStop, rejectMove: F },
//     { advance: bottom, shallStop: shouldKingStop, rejectMove: F },
//     { advance: bottomght, shallStop: shouldKingStop, rejectMove: F },
//     { advance: topght, shallStop: shouldKingStop, rejectMove: F },
//     { advance: topLeft, shallStop: shouldKingStop, rejectMove: F },
//     { advance: bottomLeft, shallStop: shouldKingStop, rejectMove: F },
//   ];
//   const patterns = getPatterns(rejectMove);
//   patterns.k = kingMoves.concat([
//     { advance: right, shallStop: kingsideCastlingMove(0), rejectMove: F },
//     { advance: left, shallStop: queensideCastlingMove(0), rejectMove: F },
//   ]);
//   patterns.K = kingMoves.concat([
//     { advance: right, shallStop: kingsideCastlingMove(7), rejectMove: F },
//     { advance: left, shallStop: queensideCastlingMove(7), rejectMove: F },
//   ]);
//   return patterns;
// }
//
// export function getPatternsForMoves(): PiecesPatterns {
//   const kingMoves = [
//     { advance: right, shallStop: lte(1), rejectMove: F },
//     { advance: left, shallStop: lte(1), rejectMove: F },
//     { advance: top, shallStop: lte(1), rejectMove: F },
//     { advance: bottom, shallStop: lte(1), rejectMove: F },
//     { advance: bottomght, shallStop: lte(1), rejectMove: F },
//     { advance: topght, shallStop: lte(1), rejectMove: F },
//     { advance: topLeft, shallStop: lte(1), rejectMove: F },
//     { advance: bottomLeft, shallStop: lte(1), rejectMove: F },
//   ];
//
//   const patterns = getPatterns(F);
//   patterns.k = kingMoves;
//   patterns.K = kingMoves;
//
//   return patterns;
// }

const basePatterns = {
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

function addRejection(fn: (args: MoveState) => boolean) {
  return (pattern: BasePattern): Pattern => ({
    ...pattern,
    rejectMove: fn,
  });
}

export const patterns = {
  standard: {
    p: basePatterns.p.map(addRejection(isKingUnderAttack)),
    P: basePatterns.P.map(addRejection(isKingUnderAttack)),
    r: basePatterns.r.map(addRejection(isKingUnderAttack)),
    b: basePatterns.b.map(addRejection(isKingUnderAttack)),
    n: basePatterns.n.map(addRejection(isKingUnderAttack)),
    q: basePatterns.q.map(addRejection(isKingUnderAttack)),
    k: basePatterns.k.map(addRejection(isKingUnderAttack)),
    K: basePatterns.K.map(addRejection(isKingUnderAttack)),
  },
  demo: {
    p: basePatterns.p.map(addRejection(F)),
    P: basePatterns.P.map(addRejection(F)),
    r: basePatterns.r.map(addRejection(F)),
    b: basePatterns.b.map(addRejection(F)),
    n: basePatterns.n.map(addRejection(F)),
    q: basePatterns.q.map(addRejection(F)),
    k: basePatterns.k.map(addRejection(F)),
    K: basePatterns.K.map(addRejection(F)),
  },
};

// export function getPatterns(
//   rejectMove: (args: MoveState) => boolean
// ): PiecesPatterns {
//   return {
//     p: [
//       {
//         advance: bottom,
//         shallStop: ({ step, origin }: MoveState) => {
//           if (origin.y > 1 && step >= 1) return true;
//           if (origin.y === 1 && step >= 2) return true;
//           return false;
//         },
//         rejectMove,
//       },
//       {
//         advance: bottomght,
//         shallStop: stopIfOpponent,
//         flag: flags.capture,
//         rejectMove,
//       },
//       {
//         advance: topght,
//         shallStop: stopIfOpponent,
//         flag: flags.capture,
//         rejectMove,
//       },
//     ],
//     n: [
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x + 2,
//           y: y + 1,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x + 1,
//           y: y + 2,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x - 1,
//           y: y + 2,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x - 2,
//           y: y + 1,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x - 2,
//           y: y - 1,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x - 1,
//           y: y - 2,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x + 1,
//           y: y - 2,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x + 2,
//           y: y - 1,
//         }),
//         shallStop: lte(1),
//         rejectMove,
//       },
//     ],
//     b: [
//       { advance: bottomght, shallStop: F, rejectMove },
//       { advance: topght, shallStop: F, rejectMove },
//       { advance: topLeft, shallStop: F, rejectMove },
//       { advance: bottomLeft, shallStop: F, rejectMove },
//     ],
//     r: [
//       { advance: right, shallStop: F, rejectMove },
//       { advance: left, shallStop: F, rejectMove },
//       { advance: top, shallStop: F, rejectMove },
//       { advance: bottom, shallStop: F, rejectMove },
//     ],
//     q: [
//       { advance: right, shallStop: F, rejectMove },
//       { advance: left, shallStop: F, rejectMove },
//       { advance: top, shallStop: F, rejectMove },
//       { advance: bottom, shallStop: F, rejectMove },
//       { advance: bottomght, shallStop: F, rejectMove },
//       { advance: topght, shallStop: F, rejectMove },
//       { advance: topLeft, shallStop: F, rejectMove },
//       { advance: bottomLeft, shallStop: F, rejectMove },
//     ],
//     k: [],
//     K: [],
//     P: [
//       {
//         advance: top,
//         shallStop: ({ step, origin }: MoveState) => {
//           if (origin.y < 6 && step >= 1) return true;
//           if (origin.y === 6 && step >= 2) return true;
//           return false;
//         },
//         rejectMove,
//       },
//       {
//         advance: bottomLeft,
//         shallStop: stopIfOpponent,
//         flag: flags.capture,
//         rejectMove,
//       },
//       {
//         advance: ({ x, y }: Coordinates): Coordinates => ({
//           x: x - 1,
//           y: y - 1,
//         }),
//         shallStop: stopIfOpponent,
//         flag: flags.capture,
//         rejectMove,
//       },
//     ],
//   };
// }
