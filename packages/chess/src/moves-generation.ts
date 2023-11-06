import { whitePieces, blackPieces, flags } from './constants.js';
import { updateFENStateWithMove } from './fen.js';
import {
  ChessColor,
  Coordinates,
  FENState,
  Flags,
  MoveBase,
  Piece,
  Square,
} from './types.js';
import { areOpponents, getOpponentColor, isActiveColorPiece } from './utils.js';

export function canPieceMoveToTarget(
  origin: Coordinates,
  target: Coordinates,
  state: FENState
): boolean {
  const square = state.board[origin.y][origin.x];
  const pattern = patterns[square] || patterns[square.toLowerCase()];
  const moves = generateMoves(
    origin,
    state,
    pattern.filter(({ recursive }) => !recursive)
  );
  const targetMove = moves.find(
    move => move.target.x === target.x && move.target.y === target.y
  );
  return !!targetMove;
}

export function isCellUnderCheck(
  state: FENState,
  target: Coordinates,
  colorOverride?: ChessColor
) {
  const { board } = state;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const square = board[y][x];
      if (
        square &&
        isActiveColorPiece(colorOverride || state.activeColor, square) &&
        canPieceMoveToTarget({ x, y }, target, state)
      ) {
        return true;
      }
    }
  }
  return false;
}

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

const isOutOfBound = (coord: Coordinates, board: Square[][]): boolean =>
  coord.y >= board.length ||
  coord.x >= board[0].length ||
  coord.y < 0 ||
  coord.x < 0;

const generateMovesFromPatterns = ({
  patterns,
  origin,
  state,
  piece,
}: {
  patterns: Array<Pattern>;
  origin: Coordinates;
  state: FENState;
  piece: Piece;
}): Array<MoveBase> => {
  const moves: Array<MoveBase> = [];
  for (const pattern of patterns) {
    const proceed = true;
    let step = 0;
    let lastMove = { target: origin };
    while (proceed) {
      const target = pattern.advance(lastMove.target);
      const outOfBound = isOutOfBound(target, state.board);
      if (outOfBound) break;
      const willStop = pattern.shallStop({
        step,
        target,
        origin,
        state,
      });
      if (willStop) break;

      const targetCell = state.board[target.y][target.x];
      if (targetCell) {
        if (
          areOpponents(targetCell, state.board[origin.y][origin.x] as Piece)
        ) {
          moves.push({
            piece,
            origin,
            target: target,
            ...(pattern.addFlags
              ? pattern.addFlags({ step, target, origin, state })
              : { [flags.capture]: true }),
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: target,
        ...(pattern.addFlags
          ? pattern.addFlags({ step, target, origin, state })
          : {}),
      });
      step++;
      lastMove = moves[moves.length - 1];
    }
  }
  return moves;
};

export function generateMoves(
  coord: Coordinates,
  state: FENState,
  piecePatterns: Array<Pattern>
): Array<MoveBase> {
  const piece = state.board[coord.y][coord.x];
  if (!piece) return [];

  return generateMovesFromPatterns({
    patterns: piecePatterns,
    state,
    origin: coord,
    piece,
  });
}

export function calcIfKingUnderCheck(state: FENState): boolean {
  if (!state.kings[state.activeColor]) return false;
  return isCellUnderCheck(
    state,
    state.kings[state.activeColor] as Coordinates, //why Typescript, why?????
    getOpponentColor(state.activeColor)
  );
}

export function isOpponentKingUnderCheck(state: FENState): boolean {
  const kingCoord = state.kings[getOpponentColor(state.activeColor)];
  if (!kingCoord) return false;
  return isCellUnderCheck(state, kingCoord);
}

function isMoveValid(move: MoveBase, state: FENState): boolean {
  return !isOpponentKingUnderCheck(
    updateFENStateWithMove(
      move,
      state.board,
      state.activeColor,
      state.castlingRights,
      state.halfMoves,
      state.fullMoves
    )
  );
}

function generateLegalMoves(state: FENState): Array<MoveBase> {
  const moves: Array<MoveBase> = [];
  for (let y = 0; y < state.board.length; y++) {
    const row = state.board[y];
    for (let x = 0; x < row.length; x++) {
      const square = row[x];
      if (square && isActiveColorPiece(state.activeColor, square)) {
        const pattern = patterns[square] || patterns[square.toLowerCase()];
        const pieceMoves = generateMoves({ y, x }, state, pattern)
          .map(move => {
            if (move.promotion) {
              return move.promotion.map(promotion => ({
                ...move,
                promotion: [promotion],
              }));
            }
            return move;
          })
          .flat();
        moves.push(...pieceMoves.filter(move => isMoveValid(move, state)));
      }
    }
  }
  return moves;
}

function calcCheckFlags(
  move: MoveBase,
  state: FENState
): { check?: boolean; checkmate?: boolean } {
  const moveState = updateFENStateWithMove(
    move,
    state.board,
    state.activeColor,
    state.castlingRights,
    state.halfMoves,
    state.fullMoves
  );
  const check = calcIfKingUnderCheck(moveState);
  if (!check) return {};

  if (!state.kings[moveState.activeColor]) return {};

  const checkmate = generateLegalMoves(moveState).length === 0;
  if (checkmate) return { checkmate };
  return { check: true };
}

export function generateLegalMovesForActiveSide(
  state: FENState
): Array<MoveBase> {
  return generateLegalMoves(state).map(move => {
    return {
      ...move,
      ...calcCheckFlags(move, state),
    };
  });
}
