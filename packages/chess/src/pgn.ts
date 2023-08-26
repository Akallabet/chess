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

interface PGNLogMove {
  san?: string;
  comment?: string;
  result?: string;
}

export function parseMoveText(moveText: string): PGNLogMove[] {
  return moveText
    .split('\n')
    .map(row => row.split(' '))
    .flat()
    .reduce(
      (state, curr) => {
        // console.log(curr, state);
        if (curr.startsWith('(')) {
          state.flag = 'variation';
          return state;
        }
        if (curr.endsWith(')')) {
          state.flag = '';
          return state;
        }
        if (state.flag === 'variation') {
          return state;
        }
        if (curr.startsWith('{')) {
          state.flag = 'comment';
          state.moves[state.moves.length - 1].comment.push(
            curr.replace('{', '')
          );
        } else if (curr.endsWith('}')) {
          state.flag = '';
          state.moves[state.moves.length - 1].comment.push(
            curr.replace('}', '')
          );
        } else if (state.flag === 'comment') {
          state.moves[state.moves.length - 1].comment.push(curr);
        } else if (curr.endsWith('.')) {
          state.flag = 'san';
        } else if (
          curr === '*' ||
          curr === '1-0' ||
          curr === '0-1' ||
          curr === '1/2-1/2'
        ) {
          state.moves.push({ result: curr, comment: [] });
        } else {
          state.moves.push({ san: curr, comment: [] });
        }
        return state;
      },
      {
        flag: '',
        side: '',
        moves: [] as { san?: string; comment: string[]; result?: string }[],
      }
    )
    .moves.map(({ san, comment }) => ({
      san,
      comment: comment
        .map(c => c.trim())
        .filter(Boolean)
        .join(' '),
    }));
}

export function fromPGNString(pgn: string): ChessState {
  const [tags, moveText] = pgn.split('\n\n');

  return parseMoveText(moveText).reduce(
    (state, move) => {
      if (move.result) {
        state = forceResult(move.result, state);
      } else if (move.san) {
        state = moveInternal(move.san, state);
      }
      return state;
    },
    start({
      FEN: startingFEN,
      mode: 'standard',
      ...fromPGNTagString(tags),
    })
  );
}
