import { files, ranks } from './constants.js';
import { errorCodes } from './error-codes.js';
import { Move } from './types.js';
import { isPawn } from './utils.js';

function buildSanString({
  ambiguousIndexes,
  origin,
  destination,
  promotion,
  move,
  moveSquare,
}: {
  ambiguousIndexes: Array<number>;
  origin: Array<string>;
  destination: Array<string>;
  promotion?: string;
  move: Move;
  moveSquare: Array<Move>;
}): string {
  if (ambiguousIndexes.length === 0)
    return [...origin, ...destination, promotion].join('');

  if (ambiguousIndexes.every(i => move.origin.x !== moveSquare[i].origin.x)) {
    return [...origin, files[move.origin.x], ...destination, promotion].join(
      ''
    );
  }
  if (ambiguousIndexes.every(i => move.origin.y !== moveSquare[i].origin.y)) {
    return [
      ...origin,
      String(ranks[move.origin.y]),
      ...destination,
      promotion,
    ].join('');
  }

  return [
    ...origin,
    files[move.origin.x],
    String(ranks[move.origin.y]),
    ...destination,
    promotion,
  ].join('');
}

export function translateMoveToSAN(
  moveSquare: Move[],
  moveIndex: number
): Array<string> {
  const move = moveSquare[moveIndex];

  const file = files[move.target.x];
  const rank = ranks[move.target.y];
  const capture = move.capture ? 'x' : '';
  const check = move.check ? '+' : '';
  const checkmate = move.checkmate ? '#' : '';
  const promotion = '=';
  const origin = [
    (!isPawn(move.piece) && move.piece) ||
      (move.capture && files[move.origin.x]) ||
      '',
  ];
  const destination = [capture, file, String(rank), check, checkmate];

  const ambiguousIndexes: Array<number> = [];
  for (let i = 0; i < moveSquare.length; i++) {
    if (
      i !== moveIndex &&
      moveSquare[i].piece === move.piece &&
      !moveSquare[i].promotion &&
      (moveSquare[i].origin.x === move.origin.x ||
        moveSquare[i].origin.y === move.origin.y)
    ) {
      ambiguousIndexes.push(i);
    }
  }
  if (move.promotion) {
    return move.promotion.map(piece =>
      buildSanString({
        ambiguousIndexes,
        origin,
        destination,
        promotion: `${promotion}${piece}`,
        move,
        moveSquare,
      })
    );
  }
  if (move.kingSideCastling) {
    return ['O-O'];
  }
  if (move.queenSideCastling) {
    return ['O-O-O'];
  }

  return [
    buildSanString({
      ambiguousIndexes,
      origin,
      destination,
      move,
      moveSquare,
    }),
  ];
}

export function translateSANToMove(
  san: string,
  movesBoard: Move[][][]
): Move | never {
  const moves = movesBoard.flat().flat();
  const move = moves.find(move =>
    move.san.find(sanString => sanString === san)
  );
  if (!move) throw new Error(errorCodes.wrongFormat);
  return move;
}
