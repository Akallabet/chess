import { piecesMap } from './constants.js';
import { ChessColor, Coordinates, Piece, Square } from './types.js';

export const isWhitePiece = (piece: string): boolean =>
  new RegExp(/[PNBRQK]+/).test(piece);
export const isBlackPiece = (piece: string): boolean =>
  new RegExp(/[pnbrqk]+/).test(piece);
export const isActiveColorWhite = (color: string): boolean => color === 'w';
export const isActiveColorBlack = (color: string): boolean => color === 'b';
export const getOpponentColor = (color: string): string =>
  isActiveColorWhite(color) ? 'b' : 'w';
export const getPieceColor = (piece: string) =>
  isWhitePiece(piece) ? 'w' : 'b';
export const isOpponentPiece = (color: string, piece: string): boolean =>
  (isActiveColorWhite(color) && isBlackPiece(piece)) ||
  (isActiveColorBlack(color) && isWhitePiece(piece));
export const isActiveColorPiece = (
  activeColor: string,
  piece: string
): boolean => activeColor === getPieceColor(piece);
export const isOpponentColorPiece = (
  activeColor: string,
  piece: string
): boolean => activeColor !== getPieceColor(piece);

export const areOpponents = (pa: string, pb: string) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

export const getKingPiece = (color: ChessColor) => (color === 'w' ? 'K' : 'k');

export const isKing = (piece: Piece) =>
  piece === piecesMap.k || piece === piecesMap.K;

export const isRook = (piece: string) =>
  piece === piecesMap.r || piece === piecesMap.R;

export const isPawn = (piece: string): boolean => {
  return piece === piecesMap.p || piece === piecesMap.P;
};

export const getPieceCoord = (
  piece: Piece,
  board: Square[][]
): Coordinates | null => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === piece) return { y, x };
    }
  }
  return null;
};
