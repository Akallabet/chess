import { Move, PGNState } from './types.js';

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
