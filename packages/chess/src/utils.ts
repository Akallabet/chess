import {
  blackPiecesArray,
  colours,
  piecesMap,
  whitePiecesArray,
} from './constants.js';
import { ChessColor, Coordinates, Piece, Square } from './types.js';

const isActiveColorWhite = (color: ChessColor): boolean => color === colours.w;
const isActiveColorBlack = (color: ChessColor): boolean => color === colours.b;
export const isWhitePiece = (piece: Piece): boolean =>
  whitePiecesArray.includes(piece);
export const isBlackPiece = (piece: Piece): boolean =>
  blackPiecesArray.includes(piece);
export const getPieceColor = (piece: Piece) =>
  isWhitePiece(piece) ? colours.w : colours.b;
export const isOpponentPiece = (color: ChessColor, piece: Piece): boolean =>
  (isActiveColorWhite(color) && isBlackPiece(piece)) ||
  (isActiveColorBlack(color) && isWhitePiece(piece));
export const isActiveColorPiece = (
  activeColor: ChessColor,
  piece: Piece
): boolean => activeColor === getPieceColor(piece);
export const isOpponentColorPiece = (
  activeColor: ChessColor,
  piece: Piece
): boolean => activeColor !== getPieceColor(piece);

export const areOpponents = (pa: Piece, pb: Piece) =>
  (isWhitePiece(pa) && isBlackPiece(pb)) ||
  (isBlackPiece(pa) && isWhitePiece(pb));

export const isKing = (piece: Piece) =>
  piece === piecesMap.k || piece === piecesMap.K;

export const isRook = (piece: Piece) =>
  piece === piecesMap.r || piece === piecesMap.R;

export const isPawn = (piece: Piece): boolean => {
  return piece === piecesMap.p || piece === piecesMap.P;
};

export function getPieceCoord(
  piece: Piece,
  board: Square[][]
): Coordinates | undefined {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === piece) return { y, x };
    }
  }
  return undefined;
}
