import { errorCodes } from '../error-codes.js';
import { Move } from '../types.js';

export function translateSANToMove(
  san: string,
  movesBoard: Move[][][]
): Move | never {
  const moves = movesBoard.flat().flat();
  const move = moves.find(move =>
    move.san.find(sanString => sanString === san)
  );
  if (!move) throw new Error(errorCodes.wrongFormat); // if (!option) return { error: errorCodes.wrongFormat };
  return move;
}
