import type {
  ChessBoardAddress,
  EmptySquare,
  Files,
  Piece,
  Ranks,
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
export const positions: ChessBoardAddress[] = getPositions(files, ranks).flat();
export const colours = { w: 'w', b: 'b' };
export const blackPieces = 'pnbrqk';
export const whitePieces = 'PNBRQK';
export const pieces = `${blackPieces}${whitePieces}`;
export const piecesMap: Record<Piece, string> = {
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
export const flags = {
  capture: 'capture',
  move: 'move',
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
