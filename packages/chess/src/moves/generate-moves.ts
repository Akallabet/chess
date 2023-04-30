import { flags, modesList } from '../constants.js';
import { modesMap } from '../modes.js';
import { Coordinates, InternalState, Move } from '../types.js';
import { areOpponents, isActiveColorPiece } from '../utils/index.js';
import {
  getPatternsForMoves,
  getPatternsForLegalMoves,
  Pattern,
  patterns,
} from './patterns.js';

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
}) => {
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
  state: InternalState
): Array<Move> => {
  const { piece } = state.board[coord.y][coord.x];

  if (!piece) return [];

  const allPatterns = getPatternsForMoves();
  const patterns = allPatterns[piece] || allPatterns[piece.toLowerCase()];

  const moves = generateMovesFromPatterns({
    patterns,
    state,
    origin: coord,
    moves: [],
  });
  return moves;
};

export function generateLegalMoves(
  origin: Coordinates,
  state: InternalState
): Array<Move> {
  const { addCheckFlag, rejectMove } = modesMap[state.mode || modesList[0]];
  const { piece } = state.board[origin.y][origin.x];

  if (!piece) return [];

  // const allPatterns = getPatternsForLegalMoves(rejectMove);
  // const patterns = allPatterns[piece] || allPatterns[piece.toLowerCase()];

  const moves = generateMovesFromPatterns({
    patterns:
      patterns[state.mode || modesList[0]][piece] ||
      patterns[state.mode || modesList[0]][piece.toLowerCase()],
    state,
    origin,
    moves: [],
  }).map(move => addCheckFlag({ origin, state, move }));

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
