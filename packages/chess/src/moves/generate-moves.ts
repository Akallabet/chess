import { flags, modes } from '../constants.js';
import { errorCodes } from '../error-codes.js';
import {
  ChessBoardType,
  Coordinates,
  InternalState,
  LegalMove,
  Move,
  MoveCell,
} from '../types.js';
import {
  areOpponents,
  getKingPiece,
  getPieceCoord,
  isActiveColorPiece,
} from '../utils.js';
import { canPieceMoveToTarget } from './is-cell-under-check.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { Pattern, patterns, patternsCheck } from './patterns.js';

interface MovePattern extends LegalMove {
  invalid?: boolean;
}
interface MovePatternResult extends MoveCell {
  target: Coordinates;
}

const isNotInvalid = (move: MovePattern): boolean => !move.invalid;
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
}): Array<MovePatternResult> => {
  const moves: Array<MovePattern> = [];
  for (const pattern of patterns) {
    const proceed = true;
    let step = 0;
    let lastMove = { target: origin };
    while (proceed) {
      const current = pattern.advance(lastMove.target);
      if (isOutOfBound(current, state.board)) break;
      if (pattern.shallStop({ step, current, origin, state })) break;

      const targetCell = state.board[current.y][current.x];
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
            target: current,
            flags: { [pattern.flag || flags.capture]: true },
            invalid: pattern.rejectMove({ step, origin, state, current }),
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: current,
        flags: {
          [pattern.flag || flags.move]: true,
        },
        invalid: pattern.rejectMove({ step, origin, state, current }),
      });
      step++;
      lastMove = moves[moves.length - 1];
    }
  }
  const validMoves = moves.filter(isNotInvalid);

  for (const move of validMoves) {
    delete move.invalid;
  }

  return validMoves;
};

export const generateMoves = (
  coord: Coordinates,
  state: InternalState,
  patterns: Record<string, Record<string, Array<Pattern>>> = patternsCheck
): Array<MovePatternResult> => {
  const { piece } = state.board[coord.y][coord.x];

  if (!piece) return [];

  const moves = generateMovesFromPatterns({
    patterns: patterns[state.mode][piece as string],
    state,
    origin: coord,
    piece,
  });
  return moves;
};

function isCheck({
  move,
  state,
}: {
  move: Move;
  state: InternalState;
}): [boolean, Coordinates | undefined, InternalState] {
  const moveState = moveAndUpdateState(move.origin, move.target, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  return [
    canPieceMoveToTarget(move.target, kingCoord, moveState),
    kingCoord,
    moveState,
  ];
}

export function generateLegalMoves(
  origin: Coordinates,
  state: InternalState
): Array<Move> {
  const moves = generateMoves(origin, state, patterns) as Array<Move>;
  // console.log('Moves for', origin, moves);

  if (state.mode === modes.standard) {
    for (const move of moves) {
      const [check, opponentKingCoord, moveState] = isCheck({ state, move });
      if (check && opponentKingCoord) {
        move.flags.check = true;

        const opponentMoves = generateLegalMovesForAllPieces(
          moveState
        ) as Array<Move>;
        if (opponentMoves.length === 0) {
          move.flags.checkmate = true;
        }
      }
    }
  }

  return moves;
}

export function generateLegalMovesForAllPieces(
  state: InternalState
): Array<LegalMove> {
  const moves = [];
  for (let y = 0; y < state.board.length; y++) {
    for (let x = 0; x < state.board[y].length; x++) {
      if (
        state.board[y][x].piece &&
        isActiveColorPiece(state.activeColor, state.board[y][x].piece as string) // bad bad bad, please remove coercion :(
      ) {
        const legalMoves = generateLegalMoves({ x, y }, state);
        for (let i = 0; i < legalMoves.length; i++) {
          moves.push(legalMoves[i]);
        }
      }
    }
  }
  return moves;
}
