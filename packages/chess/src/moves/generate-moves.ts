import { flags, modes } from '../constants.js';
import { errorCodes } from '../error-codes.js';
import { Coordinates, InternalState, Move } from '../types.js';
import {
  areOpponents,
  getKingPiece,
  getPieceCoord,
  isActiveColorPiece,
} from '../utils/index.js';
import { canPieceMoveToTarget } from './is-cell-under-check.js';
import { moveAndUpdateState } from './move-and-update-state.js';
import { Pattern, patterns, patternsCheck } from './patterns.js';

interface MovePattern extends Move {
  invalid?: boolean;
}

const isNotInvalid = (move: MovePattern): boolean => !move.invalid;
const removeInvalidProp = (move: MovePattern): MovePattern => {
  delete move.invalid;
  return move;
};

const generateMovesFromPatterns = ({
  patterns,
  origin,
  state,
  moves = [],
}: {
  patterns: Array<Pattern>;
  origin: Coordinates;
  state: InternalState;
  moves: Array<MovePattern>;
}): Array<Move> => {
  for (let i = 0; i < patterns.length; i++) {
    const { advance, shallStop, flag, rejectMove } = patterns[i];
    const proceed = true;
    let step = 0;
    let prevMove = { coord: origin };
    while (proceed) {
      const current = advance(prevMove.coord);
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
            origin,
            coord: current,
            flags: { [flag || flags.capture]: true },
            invalid,
          });
        }
        break;
      }
      moves.push({
        origin,
        coord: current,
        flags: {
          [flag || flags.move]: true,
        },
        invalid,
      });
      step++;
      prevMove = moves[moves.length - 1];
    }
  }
  return moves.filter(isNotInvalid).map(removeInvalidProp);
};

export const generateMoves = (
  coord: Coordinates,
  state: InternalState,
  patterns: Record<string, Record<string, Array<Pattern>>> = patternsCheck
): Array<Move> => {
  const { piece } = state.board[coord.y][coord.x];

  if (!piece) return [];

  const moves = generateMovesFromPatterns({
    patterns: patterns[state.mode][piece as string],
    state,
    origin: coord,
    moves: [],
  });
  return moves;
};

const addCheckFlag = ({
  origin,
  state,
  move: moveData,
}: {
  origin: Coordinates;
  state: InternalState;
  move: Move;
}): Move => {
  const moveState = moveAndUpdateState(origin, moveData.coord, state);
  const kingCoord = getPieceCoord(getKingPiece(moveState), moveState.board);
  if (!kingCoord) throw new Error(errorCodes.king_not_found);

  const isUnderCheck = canPieceMoveToTarget(
    moveData.coord,
    kingCoord,
    moveState
  );

  if (isUnderCheck) moveData.flags.check = true;
  return moveData;
};

export function generateLegalMoves(
  origin: Coordinates,
  state: InternalState
): Array<Move> {
  const moves = generateMoves(origin, state, patterns);

  if (state.mode === modes.standard) {
    return moves.map(move => addCheckFlag({ origin, state, move }));
  }

  return moves;
}

export function generateLegalMovesForAllPieces(state: InternalState): Move[] {
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
