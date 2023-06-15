import * as R from 'ramda';
import { files, pieces, piecesMap, ranks } from './constants.js';
import { errorCodes } from './error-codes.js';
import { generateLegalMoves } from './moves/generate-moves.js';
import {
  ChessState,
  Coordinates,
  InternalState,
  Move,
  Piece,
} from './types.js';
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
  const move = moveSquare[moveIndex];
  const { flags, coord, piece } = move;

  const file = files[coord.x];
  const rank = ranks[coord.y];
  const capture = flags.capture ? 'x' : '';
  const check = flags.check ? '+' : '';
  // const checkmate = flags.checkmate ? '#' : '';
  const sanOrigin = [
    piece !== piecesMap.p && piece !== piecesMap.P ? piece : '',
  ];
  const sanDestination = [capture, file, String(rank), check];

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

function isPawn(piece: Piece) {
  return piece === piecesMap.p || piece === piecesMap.P;
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
    parse: (SAN: string, state: ChessState) => {
      const [file, rank] = R.split('', SAN);
      const target = {
        x: files.indexOf(file),
        y: ranks.indexOf(Number(rank)),
      };

      const moves = state.movesBoard[target.y][target.x].filter(move =>
        isPawn(move.piece)
      );

      if (moves.length !== 1) throw new Error(errorCodes.wrongMove);

      const origin = moves[0].origin;
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

type MoveCoordinates = {
  origin: Coordinates;
  target: Coordinates;
};

export function fromSANToCoordinates(
  SAN: string,
  state: ChessState
): MoveCoordinates | never {
  const option = R.find(({ expr }) => {
    return R.test(expr, SAN);
  }, SANOptions);
  if (!option) throw new Error(errorCodes.wrongFormat); // if (!option) return { error: errorCodes.wrongFormat };
  const { parse } = option;
  return parse(SAN, state);
}
