import { PGNState } from './types.js';

// specs https://www.chessclub.com/help/PGN-spec
export function buildPGNString({
  event = '?',
  site = '?',
  date = `????.??.??`,
  round = '?',
  white = '?',
  black = '?',
  result = '*',
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
  return headerTags.join('\n') + '\n\n';
}
