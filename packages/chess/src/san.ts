import * as R from 'ramda';
import { files, pieces, piecesMap, ranks } from './constants.js';
import { errorCodes } from './error-codes.js';
import { generateLegalMoves } from './moves/generate-moves.js';
import { getOriginsForTargetCell } from './moves/is-cell-under-check.js';
import { InternalState, Move } from './types.js';
import { getPieceCoord } from './utils.js';

const filesString = R.join('', files);
const ranksString = R.join('', ranks);

// If the piece is sufficient to unambiguously determine the origin square, the whole from square is omitted. Otherwise, if two (or more) pieces of the same kind can move to the same square, the piece's initial is followed by (in descending order of preference)
//
// file of departure if different
// rank of departure if the files are the same but the ranks differ
// the complete origin square coordinate otherwise

export function generateSANForMove(
  moveSquare: Array<Move>,
  moveIndex: number
): string {
  // generate unambiguous standard algebraic notation for each move
  const move = moveSquare[moveIndex];
  const { flags, coord, piece } = move;
  // const san = piece !== piecesMap.p && piece !== piecesMap.P ? piece : '';
  const san = [piece !== piecesMap.p && piece !== piecesMap.P ? piece : ''];
  // const movesWithSamePiece = [];
  for (let i = 0; i < moveSquare.length; i++) {
    if (i !== moveIndex && moveSquare[i].piece === move.piece) {
      // movesWithSamePiece.push(moveSquare[i]);
      san.push(files[move.origin.x]);
    }
  }
  const file = files[coord.x];
  const rank = ranks[coord.y];
  // const { x: cx, y: cy } = coord;
  // const pieceName = piece[0].toUpperCase();
  const capture = flags.capture ? 'x' : '';
  // const promotion = flags.promotion ? `=${flags.promotion}` : '';
  const check = flags.check ? '+' : '';
  // const checkmate = flags.checkmate ? '#' : '';
  // const disambiguation = getDisambiguation(state, move);
  san.push(capture, file, String(rank), check);
  // return `${pieceName}${capture}${file}${rank}${check}`;
  return san.join('');
}

const SANOptions = [
  // [
  //   `^[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
  //   ([file, rank]) => ({
  //     name: pieces.P,
  //     y: ranks.indexOf(rank),
  //     x: files.indexOf(file),
  //   }),
  // ],
  // [
  //   `^[${Object.values(pieces)}]{1}[${files.join('')}]{1}[${ranks.join(
  //     ''
  //   )}]{1}$`,
  //   ([name, file, rank]) => ({
  //     name,
  //     y: ranks.indexOf(rank),
  //     x: files.indexOf(file),
  //   }),
  // ],
  {
    expr: new RegExp(`^[${filesString}]{1}[${ranksString}]{1}$`),
    parse: (SAN: string, state: InternalState) => {
      const [file, rank] = R.split('', SAN);
      const target = {
        x: R.indexOf(file, files),
        y: R.indexOf(Number(rank), ranks),
      };
      const origins = getOriginsForTargetCell(target, state.activeColor, state);

      if (origins.length > 1) throw new Error(errorCodes.wrongMove);

      const origin = origins[0];
      const piece = R.path([origin.y, origin.x, 'piece'], state.board);

      if (piece !== piecesMap.P && piece !== piecesMap.p)
        throw new Error(errorCodes.wrongMove);

      return {
        piece,
        origin: origin,
        target,
      };
    },
  },
  {
    expr: new RegExp(
      `^[${pieces}]{1}[${filesString}]{1}[${ranksString}]{1}[${filesString}]{1}[${ranksString}]{1}$`
    ),
    parse: (SAN: string) => {
      const [piece, fileOrigin, rankOrigin, fileTarget, rankTarget] = R.split(
        '',
        SAN
      );
      return {
        piece,
        origin: {
          x: R.indexOf(fileOrigin, files),
          y: R.indexOf(Number(rankOrigin), ranks),
        },
        target: {
          x: R.indexOf(fileTarget, files),
          y: R.indexOf(Number(rankTarget), ranks),
        },
      };
    },
  },
  {
    expr: new RegExp(`^[${pieces}]{1}[${filesString}]{1}[${ranksString}]{1}$`),
    parse: (SAN: string, state: InternalState) => {
      const [piece, fileTarget, rankTarget] = R.split('', SAN);
      const target = {
        x: R.indexOf(fileTarget, files),
        y: R.indexOf(Number(rankTarget), ranks),
      };
      const origin = getPieceCoord(piece, state.board);

      if (!origin) throw new Error(errorCodes.wrongMove);

      const hasTargetMove = R.find(
        ({ coord: { x, y } }) => x === target.x && y === target.y,
        generateLegalMoves(origin, state)
      );

      if (!hasTargetMove) throw new Error();
      return { piece, origin, target };
    },
  },
  // [
  //   `^[${files.join('')}]{1}[${ranks.join('')}]{1}[${files.join(
  //     ''
  //   )}]{1}[${ranks.join('')}]{1}$`,
  //   ([originFile, originRank, file, rank]) => ({
  //     name: pieces.P,
  //     originX: files.indexOf(originFile),
  //     originY: ranks.indexOf(originRank),
  //     y: ranks.indexOf(rank),
  //     x: files.indexOf(file),
  //   }),
  // ],
  // [
  //   `^[${Object.values(pieces).join('')}]{1}[${files.join('')}]{1}[${files.join(
  //     ''
  //   )}]{1}[${ranks.join('')}]{1}$`,
  //   ([name, originFile, file, rank]) => ({
  //     name,
  //     originX: files.indexOf(originFile),
  //     y: ranks.indexOf(rank),
  //     x: files.indexOf(file),
  //   }),
  // ],
  // [
  //   `^[${files.join('')}]{1}[${files.join('')}]{1}[${ranks.join('')}]{1}$`,
  //   ([originX, file, rank]) => ({
  //     name: pieces.P,
  //     originX: files.indexOf(originX),
  //     y: ranks.indexOf(rank),
  //     x: files.indexOf(file),
  //   }),
  // ],
  // [
  //   `^0-0$`,
  //   () => ({
  //     name: pieces.K,
  //     isCastling: true,
  //     isKingside: true,
  //     isQueenside: false,
  //   }),
  // ],
  // [
  //   `^0-0-0$`,
  //   () => ({
  //     name: pieces.K,
  //     isCastling: true,
  //     isKingside: false,
  //     isQueenside: true,
  //   }),
  // ],
];
export const fromSANToCoordinates = (SAN: string, state: InternalState) => {
  const option = R.find(({ expr }) => {
    return R.test(expr, SAN);
  }, SANOptions);
  if (!option) throw new Error(errorCodes.wrongFormat);
  const { parse } = option;
  return parse(SAN, state);
};
