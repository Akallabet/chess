import { PGNState } from './types.js';

// specs https://www.chessclub.com/help/PGN-spec

function buildPGNTags({
  event = '?',
  site = '?',
  date = `????.??.??`,
  round = '?',
  white = '?',
  black = '?',
  result = '*',
}: PGNState) {
  return [
    `[Event "${event}"]`,
    `[Site "${site}"]`,
    `[Date "${date}"]`,
    `[Round "${round}"]`,
    `[White "${white}"]`,
    `[Black "${black}"]`,
    `[Result "${result}"]`,
  ];
}

function buildPGNMoveText({ moves = [] }: PGNState) {
  return moves
    .map(([white, black], i) => {
      return [`${i + 1}.`, white.san || '...', black?.san].filter(Boolean);
    })
    .map(moveText => moveText.join(' '));
}

function buildResult({ result = '*' }: PGNState) {
  return result !== '*' ? ` ${result}` : '';
}

export function buildPGNString(state: PGNState) {
  return (
    [...buildPGNTags(state), ...buildPGNMoveText(state)].join('\n') +
    buildResult(state) +
    '\n\n'
  );
}
