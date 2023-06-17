import { files, piecesMap, ranks } from '../constants.js';
import { Move } from '../types.js';

// If the piece is sufficient to unambiguously determine the origin square, the whole from square is omitted. Otherwise, if two (or more) pieces of the same kind can move to the same square, the piece's initial is followed by (in descending order of preference)
//
// file of departure if different
// rank of departure if the files are the same but the ranks differ
// the complete origin square coordinate otherwise

export function translateMoveToSAN(
  moveSquare: Array<Move>,
  moveIndex: number
): string {
  const move = moveSquare[moveIndex];
  const { flags, coord, piece } = move;

  const file = files[coord.x];
  const rank = ranks[coord.y];
  const capture = flags.capture ? 'x' : '';
  const check = flags.check ? '+' : '';
  const checkmate = flags.checkmate ? '#' : '';
  const sanOrigin = [
    piece !== piecesMap.p && piece !== piecesMap.P ? piece : '',
  ];
  const sanDestination = [capture, file, String(rank), check, checkmate];

  const ambiguousIndexes = [];
  for (let i = 0; i < moveSquare.length; i++) {
    if (i !== moveIndex && moveSquare[i].piece === move.piece) {
      ambiguousIndexes.push(i);
    }
  }
  if (ambiguousIndexes.length === 0)
    return [...sanOrigin, ...sanDestination].join('');

  if (ambiguousIndexes.every(i => move.origin.x !== moveSquare[i].origin.x)) {
    return [...sanOrigin, files[move.origin.x], ...sanDestination].join('');
  }
  if (ambiguousIndexes.every(i => move.origin.y !== moveSquare[i].origin.y)) {
    return [...sanOrigin, String(ranks[move.origin.y]), ...sanDestination].join(
      ''
    );
  }

  return [
    ...sanOrigin,
    files[move.origin.x],
    String(ranks[move.origin.y]),
    ...sanDestination,
  ].join('');
}
