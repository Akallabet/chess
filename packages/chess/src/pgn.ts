import { Move, PGNState } from './types.js';

// specs https://www.chessclub.com/help/PGN-spec

function buildPGNMoves(moves: Move[]) {
  const movesString = moves
    .map((move, i) => {
      const { san } = move;
      const moveNumber = i + 1;
      return `${moveNumber}. ${san}`;
    })
    .join(' ');

  return `${movesString}`;
}

export function buildPGNString({
  event = '?',
  site = '?',
  date = `????.??.??`,
  round = '?',
  white = '?',
  black = '?',
  result = '*',
  moves = [],
}: PGNState) {
  const headerTags = [
    `[Event "${event}"]`,
    `[Site "${site}"]`,
    `[Date "${date}"]`,
    `[Round "${round}"]`,
    `[White "${white}"]`,
    `[Black "${black}"]`,
    `[Result "${result}"]`,
  ];
  const movesString = buildPGNMoves(moves);
  return headerTags.join('\n') + movesString + '\n\n';
}
