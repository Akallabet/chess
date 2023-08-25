import type {
  BlackPiece,
  ChessBoardAddress,
  ChessColor,
  EmptySquare,
  Files,
  Piece,
  PieceType,
  Ranks,
  WhitePiece,
} from './types.js';

function getPositions(files: Files, ranks: Ranks): ChessBoardAddress[][] {
  const positions = [];
  for (const rank of ranks) {
    const row: ChessBoardAddress[] = [];
    for (const file of files) {
      row.push(`${file}${rank}`);
    }
    positions.push(row);
  }
  return positions;
}

export const emptySquare: EmptySquare = '' as EmptySquare;
export const files: Files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks: Ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
export const positionsBoard: ChessBoardAddress[][] = getPositions(files, ranks);
export const positions: ChessBoardAddress[] = positionsBoard.flat();
export const colours: Record<ChessColor, ChessColor> = { w: 'w', b: 'b' };
export const piecesMap: Record<Piece, Piece> = {
  p: 'p',
  n: 'n',
  b: 'b',
  r: 'r',
  q: 'q',
  k: 'k',
  P: 'P',
  N: 'N',
  B: 'B',
  R: 'R',
  Q: 'Q',
  K: 'K',
};
export const blackPieces: Record<PieceType, BlackPiece> = {
  pawn: 'p',
  knight: 'n',
  bishop: 'b',
  rook: 'r',
  queen: 'q',
  king: 'k',
};
export const whitePieces: Record<PieceType, WhitePiece> = {
  pawn: 'P',
  knight: 'N',
  bishop: 'B',
  rook: 'R',
  queen: 'Q',
  king: 'K',
};
export const whitePiecesArray: string[] = Object.values(whitePieces);
export const blackPiecesArray: string[] = Object.values(blackPieces);
export const piecesByColor = {
  [colours.b]: blackPieces,
  [colours.w]: whitePieces,
};

export const flags = {
  capture: 'capture',
  selected: 'selected',
  check: 'check',
  promotion: 'promotion',
  enPassant: 'enPassant',
  kingSideCastling: 'kingSideCastling',
  queenSideCastling: 'queenSideCastling',
};
export const modes = {
  standard: 'standard',
  practice: 'practice',
  demo: 'demo',
};
export const startingFEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
