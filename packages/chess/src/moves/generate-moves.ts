import { flags, modes } from '../constants.js';
import { errorCodes } from '../error-codes.js';
import {
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
  for (let i = 0; i < patterns.length; i++) {
    const { advance, shallStop, flag, rejectMove } = patterns[i];
    const proceed = true;
    let step = 0;
    let prevMove = { target: origin };
    while (proceed) {
      const current = advance(prevMove.target);
      if (
        current.y >= state.board.length ||
        current.x >= state.board[0].length ||
        current.y < 0 ||
        current.x < 0
      )
        break;
      if (shallStop({ step, current, origin, state })) break;
      const invalid = rejectMove({ step, origin, state, current });

      const cell = state.board[current.y][current.x];
      if (cell.piece) {
        if (
          areOpponents(
            cell.piece,
            state.board[origin.y][origin.x].piece as string
          )
        ) {
          moves.push({
            piece,
            origin,
            target: current,
            flags: { [flag || flags.capture]: true },
            invalid,
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: current,
        flags: {
          [flag || flags.move]: true,
        },
        invalid,
      });
      step++;
      prevMove = moves[moves.length - 1];
    }
  }
  const validMoves = moves.filter(isNotInvalid);

  for (let i = 0; i < validMoves.length; i++) {
    delete validMoves[i].invalid;
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

const isCheckMove = ({
  origin,
  state,
  move: moveData,
}: {
  origin: Coordinates;
  state: InternalState;
  move: Move;
}): boolean => {
  const moveState = moveAndUpdateState(origin, moveData.target, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  const isUnderCheck = canPieceMoveToTarget(
    moveData.target,
    kingCoord,
    moveState
  );

  return isUnderCheck;
};

export function generateLegalMoves(
  origin: Coordinates,
  state: InternalState
): Array<Move> {
  const moves = generateMoves(origin, state, patterns) as Array<Move>;

  if (state.mode === modes.standard) {
    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      if (isCheckMove({ origin, state, move })) {
        move.flags.check = true;
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
