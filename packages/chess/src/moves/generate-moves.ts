import * as R from 'ramda';
import { Coordinates } from '../chess.js';
import { flags, modesList } from '../constants.js';
import { modesMap } from '../modes.js';
import { InternalState, Move } from '../types.js';
import { areOpponents, isActiveColorPiece } from '../utils/index.js';
import { getPatternsForMoves, getPatternsForLegalMoves } from './patterns.js';

const isNotInvalid = move => !move.invalid;
const deleteInvalid = move => {
  delete move.invalid;
  return move;
};

const generateMovesFromPatterns = ({ patterns, origin, state, moves = [] }) => {
  for (let i = 0; i < patterns.length; i++) {
    const { step, shallStop, flag, rejectMove } = patterns[i];
    let proceed = true;
    let stepsCount = 0;
    let prevMove = { coord: origin };
    while (proceed) {
      const currentCoord = step(prevMove.coord, state);
      if (
        currentCoord.y >= state.board.length ||
        currentCoord.x >= state.board[0].length ||
        currentCoord.y < 0 ||
        currentCoord.x < 0
      )
        break;
      if (shallStop(stepsCount, currentCoord, origin, state)) break;
      const invalid = rejectMove(origin, state, currentCoord);

      const cell = state.board[currentCoord.y][currentCoord.x];
      if (cell.piece) {
        if (areOpponents(cell.piece, state.board[origin.y][origin.x].piece)) {
          moves.push({
            coord: currentCoord,
            flags: { [flag || flags.capture]: true },
            invalid,
          });
        }
        break;
      }
      moves.push({
        coord: currentCoord,
        flags: {
          [flag || flags.move]: true,
        },
        invalid,
      });
      stepsCount++;
      prevMove = moves[moves.length - 1];
    }
  }
  return moves.filter(isNotInvalid).map(deleteInvalid);
};

export const generateMoves = (
  coord: Coordinates,
  state: InternalState
): Array<Move> => {
  const { piece } = state.board[coord.y][coord.x];

  if (!piece) return [];

  const patterns = getPatternsForMoves();
  const moves = generateMovesFromPatterns({
    patterns: patterns[piece] || patterns[piece.toLowerCase()],
    state,
    origin: coord,
    moves: [],
  });
  return moves;
};

export function generateLegalMoves(
  coord: Coordinates,
  state: InternalState
): Array<Move> {
  const { addCheckFlag } = modesMap[state.mode || modesList[0]];
  const { piece } = state.board[coord.y][coord.x];

  if (!piece) return [];

  const patterns = getPatternsForLegalMoves(state);

  const moves = generateMovesFromPatterns({
    patterns: patterns[piece] || patterns[piece.toLowerCase()],
    state,
    origin: { ...coord },
    moves: [],
  })
    .map(addCheckFlag(coord, state))
    .map(move => {
      move.origin = coord;
      return move;
    });
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
