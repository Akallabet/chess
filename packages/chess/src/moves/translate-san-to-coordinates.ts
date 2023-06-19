import { files, pieces, piecesMap, ranks } from '../constants.js';
import { errorCodes } from '../error-codes.js';
import { ChessState, Move, Piece } from '../types.js';

const filesString = files.join('');
const ranksString = ranks.join('');

// If the piece is sufficient to unambiguously determine the origin square, the whole from square is omitted. Otherwise, if two (or more) pieces of the same kind can move to the same square, the piece's initial is followed by (in descending order of preference)
//
// file of departure if different
// rank of departure if the files are the same but the ranks differ
// the complete origin square coordinate otherwise

function isPawn(piece: Piece | undefined) {
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
      const [file, rank] = SAN.split('');
      const target = {
        x: files.indexOf(file),
        y: ranks.indexOf(Number(rank)),
      };

      const moves = state.movesBoard[target.y][target.x].filter(move =>
        isPawn(move.piece)
      );

      if (moves.length !== 1) throw new Error(errorCodes.wrongMove);

      const origin = moves[0].origin;
      if (!isPawn(state.board[origin.y][origin.x].piece))
        throw new Error(errorCodes.wrongMove);

      return moves[0];
    },
  },
  {
    expr: new RegExp(
      `^[${pieces}]{1}[${filesString}]{1}[${ranksString}]{1}[${filesString}]{1}[${ranksString}]{1}$`
    ),
    parse: (SAN: string, state: ChessState) => {
      const [piece, fileOrigin, rankOrigin, fileTarget, rankTarget] =
        SAN.split('');
      const target = {
        x: files.indexOf(fileTarget),
        y: ranks.indexOf(Number(rankTarget)),
      };
      const origin = {
        x: files.indexOf(fileOrigin),
        y: ranks.indexOf(Number(rankOrigin)),
      };

      const moves = state.movesBoard[target.y][target.x].filter(
        move =>
          move.piece === piece &&
          move.origin.x === origin.x &&
          move.origin.y === origin.y
      );

      if (moves.length !== 1) throw new Error(errorCodes.wrongMove);

      return moves[0];
    },
  },
  {
    expr: new RegExp(`^[${pieces}]{1}[${filesString}]{1}[${ranksString}]{1}$`),
    parse: (SAN: string, state: ChessState) => {
      const [piece, fileTarget, rankTarget] = SAN.split('');
      const target = {
        x: files.indexOf(fileTarget),
        y: ranks.indexOf(Number(rankTarget)),
      };
      const moves = state.movesBoard[target.y][target.x].filter(
        move => move.piece === piece
      );
      if (moves.length !== 1) throw new Error(errorCodes.wrongMove);

      return moves[0];
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

export function translateSANToCoordinates(
  SAN: string,
  state: ChessState
): Move | never {
  const option = SANOptions.find(({ expr }) => expr.test(SAN));
  if (!option) throw new Error(errorCodes.wrongFormat); // if (!option) return { error: errorCodes.wrongFormat };
  const { parse } = option;
  return parse(SAN, state);
}
