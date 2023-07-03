import { flags, modes } from '../constants.js';
import {
  ChessBoardType,
  Coordinates,
  InternalState,
  MoveBase,
} from '../types.js';
import {
  areOpponents,
  getKingPiece,
  getPieceCoord,
  isActiveColorPiece,
} from '../utils.js';
import {
  canPieceMoveToTarget,
  isCellUnderCheck,
} from './is-cell-under-check.js';
import { isInvalidMove } from './is-move-invalid.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { Pattern, patterns } from './patterns.js';

const isOutOfBound = (coord: Coordinates, board: ChessBoardType): boolean =>
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
  state: InternalState;
  piece: string;
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
      if (targetCell.piece) {
        if (
          areOpponents(
            targetCell.piece,
            state.board[origin.y][origin.x].piece as string
          )
        ) {
          moves.push({
            piece,
            origin,
            target: target,
            flags: { [pattern.flag || flags.capture]: true },
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: target,
        flags: {
          [pattern.flag || flags.move]: true,
        },
      });
      step++;
      lastMove = moves[moves.length - 1];
    }
  }
  return moves;
};

export const generateMoves = (
  coord: Coordinates,
  state: InternalState,
  piecePatterns: Array<Pattern>
): Array<MoveBase> => {
  const { piece } = state.board[coord.y][coord.x];
  if (!piece) return [];

  return generateMovesFromPatterns({
    patterns: piecePatterns,
    state,
    origin: coord,
    piece,
  });
};

function calcCheck({ move, state }: { move: MoveBase; state: InternalState }): {
  check: boolean;
  state: InternalState;
} {
  const moveState = moveAndUpdateState(move.origin, move.target, state);
  const kingCoord = getPieceCoord(
    getKingPiece(moveState.activeColor),
    moveState.board
  );
  if (!kingCoord) return { check: false, state: moveState };

  return {
    check: canPieceMoveToTarget(move.target, kingCoord, moveState),
    state: moveState,
  };
}

function isCheckMateMove(state: InternalState): boolean {
  const kingCoord = getPieceCoord(getKingPiece(state.activeColor), state.board);
  if (!kingCoord) return false;
  const kingMoves = generateMoves(
    kingCoord,
    state,
    patterns[state.board[kingCoord.y][kingCoord.x].piece as string]
  );

  return (
    kingMoves.filter(({ origin, target }) => {
      return !isInvalidMove({ origin, target, state });
    }).length === 0
  );
}

export function generateMovesForAllPieces(
  state: InternalState
): Array<MoveBase> {
  const moves: Array<MoveBase> = [];
  for (let y = 0; y < state.board.length; y++) {
    const row = state.board[y];
    for (let x = 0; x < row.length; x++) {
      const square = row[x];
      if (
        square.piece &&
        isActiveColorPiece(state.activeColor, square.piece as string) // bad bad bad, please remove coercion :(
      ) {
        const pieceMoves = generateMoves(
          { y, x },
          state,
          patterns[square.piece as string]
        );
        if (state.mode === modes.standard) {
          for (const move of pieceMoves) {
            const invalid = isInvalidMove({
              origin: move.origin,
              target: move.target,
              state,
            });
            if (!invalid) {
              const checkMove = calcCheck({
                state,
                move,
              });
              if (checkMove.check) {
                if (isCheckMateMove(checkMove.state)) {
                  move.flags.checkmate = true;
                } else {
                  move.flags.check = true;
                }
              }
              moves.push(move);
            }
          }
        }
      }
    }
  }
  return moves;
}
