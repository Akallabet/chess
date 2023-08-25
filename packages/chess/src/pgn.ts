import { startingFEN } from './constants.js';
import { draw, move, moveInternal, start } from './index.js';
import { ChessState, Move, PGNState, PGNTag } from './types.js';

// specs https://www.chessclub.com/help/PGN-spec

function buildPGNTags({
  event = '?',
  site = '?',
  date = `????.??.??`,
  round = '?',
  white = '?',
  black = '?',
  result = '*',
}: PGNState): string[] {
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

function buildPGNMoveText({ moves = [] }: PGNState): string[] {
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

function buildResult({ result = '*' }: PGNState): string {
  return result !== '*' ? ` ${result}` : '';
}

export function buildPGNString(state: PGNState): string {
  return (
    [...buildPGNTags(state), ...buildPGNMoveText(state)].join('\n') +
    buildResult(state) +
    '\n\n'
  );
}

function fromPGNTagString(tags: string): PGNState {
  return tags
    .split('\n')
    .map(tag =>
      tag
        .replace('[', '')
        .replace(']', '')
        .replaceAll('"', '')
        .replace(' ', '<%>')
        .split('<%>')
    )
    .reduce((tagsObj, [key, val]) => {
      tagsObj[key.toLowerCase() as PGNTag] = val;
      return tagsObj;
    }, {} as PGNState);
}

function forceResult(result: string, state: ChessState): ChessState {
  if (result === '1/2-1/2') {
    return draw(state);
  }
  return state;
}

export function fromPGNString(pgn: string): ChessState {
  const [tags, moveText] = pgn.split('\n\n');
  return moveText
    .split('\n')
    .map(row => row.split(' '))
    .flat()
    .reduce(
      (acc, curr) => {
        if (curr.endsWith('.')) {
          acc.flag = 'san';
          return acc;
        }
        if (curr.startsWith('{')) {
          acc.flag = 'comment';
          return acc;
        }
        if (
          curr === '*' ||
          curr === '1-0' ||
          curr === '0-1' ||
          curr === '1/2-1/2'
        ) {
          if (acc.state.result !== curr) {
            acc.state = forceResult(curr, acc.state);
          }
          return acc;
        }
        if (acc.flag === 'san') {
          acc.state = moveInternal(curr, acc.state);
          return acc;
        }
        return acc;
      },
      {
        flag: 'start',
        state: start({
          FEN: startingFEN,
          mode: 'standard',
          ...fromPGNTagString(tags),
        }),
      }
    ).state;
}
