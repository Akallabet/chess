import { flags, modes } from '../constants.js';
import { errorCodes } from '../error-codes.js';
import {
  ChessBoardType,
  Coordinates,
  InternalState,
  MoveBase,
  Move,
} from '../types.js';
import {
  areOpponents,
  getKingPiece,
  getPieceCoord,
  isActiveColorPiece,
} from '../utils.js';
import { canPieceMoveToTarget } from './is-cell-under-check.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { Pattern, patterns } from './patterns.js';

// const isNotInvalid = (move: MovePattern): boolean => !move.invalid;
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
  // const moves: Array<MovePattern> = [];
  const moves: Array<MoveBase> = [];
  // console.log('patterns from', origin);
  for (const pattern of patterns) {
    const proceed = true;
    let step = 0;
    let lastMove = { target: origin };
    while (proceed) {
      const target = pattern.advance(lastMove.target);
      // console.log('current move', current);
      const outOfBound = isOutOfBound(target, state.board);
      // console.log('is out of bound', outOfBound);
      if (outOfBound) break;
      const willStop = pattern.shallStop({
        step,
        target,
        origin,
        state,
      });
      // console.log('shall stop?', willStop);
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
            // invalid: pattern.rejectMove({
            //   step,
            //   origin,
            //   state,
            //   target,
            // }),
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
        //   invalid: pattern.rejectMove({ step, origin, state, target }),
      });
      step++;
      lastMove = moves[moves.length - 1];
    }
  }
  // const validMoves = moves.filter(isNotInvalid);
  //
  // for (const move of validMoves) {
  //   delete move.invalid;
  // }
  // // console.log('valid moves for', origin, validMoves);
  //
  // return validMoves;
  return moves;
};

export const generateMoves = (
  coord: Coordinates,
  state: InternalState
  // patterns: Record<string, Record<string, Array<Pattern>>> = patternsCheck
): Array<MoveBase> => {
  const { piece } = state.board[coord.y][coord.x];
  // console.log('generate  moves for', coord, piece);

  if (!piece) return [];

  const moves = generateMovesFromPatterns({
    patterns: patterns[state.mode][piece as string],
    state,
    origin: coord,
    piece,
  });
  return moves;
};

function isCheckMove({
  move,
  state,
}: {
  move: MoveBase;
  state: InternalState;
}): boolean {
  const moveState = moveAndUpdateState(move.origin, move.target, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  return canPieceMoveToTarget(move.target, kingCoord, moveState);
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
        const pieceMoves = generateMoves({ x, y }, state);
        if (state.mode === modes.standard) {
          for (const move of pieceMoves) {
            const check = isCheckMove({
              state,
              move,
            });
            if (check) {
              move.flags.check = true;
            }
          }
        }
        // console.log('legalMoves', { x, y }, legalMoves);
        moves.push(...pieceMoves);
      }
    }
  }
  // console.log('moves', moves);
  return moves;
}
