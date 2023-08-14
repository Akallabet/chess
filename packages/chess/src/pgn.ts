import { Move, PGNState } from './types.js';

// specs https://www.chessclub.com/help/PGN-spec

function buildPGNMoves(moves: Move[]) {
  return moves
    .reduce((acc, move) => {
      const lastMove = acc[acc.length - 1];
      if (Array.isArray(lastMove) && lastMove.length === 1) {
        acc[acc.length - 1].push(move);
      } else {
        acc.push([move]);
      }
      return acc;
    }, [] as Move[][])
    .map(([white, black], i) => {
      const moveNumber = i + 1;
      return `${moveNumber}. ${white.san} ${black?.san}`;
    });
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
  return headerTags.concat(movesString).join('\n') + '\n\n';
}
