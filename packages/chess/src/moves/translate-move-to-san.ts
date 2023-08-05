import { files, ranks } from '../constants.js';
import { Move } from '../types.js';
import { isPawn } from '../utils.js';

// If the piece is sufficient to unambiguously determine the origin square, the whole from square is omitted. Otherwise, if two (or more) pieces of the same kind can move to the same square, the piece's initial is followed by (in descending order of preference)
//
// file of departure if different
// rank of departure if the files are the same but the ranks differ
// the complete origin square coordinate otherwise

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
  moveSquare: Array<Move>,
  moveIndex: number
): Array<string> {
  const move = moveSquare[moveIndex];

  const file = files[move.target.x];
  const rank = ranks[move.target.y];
  const capture = move.flags.capture ? 'x' : '';
  const check = move.flags.check ? '+' : '';
  const checkmate = move.flags.checkmate ? '#' : '';
  const promotion = '=';
  const origin = [
    (!isPawn(move.piece) && move.piece) ||
      (move.flags.capture && files[move.origin.x]) ||
      '',
  ];
  const destination = [capture, file, String(rank), check, checkmate];

  const ambiguousIndexes: Array<number> = [];
  for (let i = 0; i < moveSquare.length; i++) {
    if (
      i !== moveIndex &&
      moveSquare[i].piece === move.piece &&
      !moveSquare[i].flags.promotion &&
      (moveSquare[i].origin.x === move.origin.x ||
        moveSquare[i].origin.y === move.origin.y)
    ) {
      ambiguousIndexes.push(i);
    }
  }
  if (move.flags.promotion) {
    return move.flags.promotion.map(piece =>
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
  if (move.flags.kingSideCastling) {
    return ['O-O'];
  }
  if (move.flags.queenSideCastling) {
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
