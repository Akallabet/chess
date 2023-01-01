export interface Square {
  piece: string;
}

export type ChessBoardType = Square[][];

export interface ChessArgs {
  board: ChessBoardType;
  FEN: string;
}

export const files: string[];
export const ranks: string[];
export function start(args: string | ChessArgs): ChessArgs;
export function getMoves(SAN: string): (args: ChessArgs) => ChessBoardType;
export function getMoves(SAN: string, args: ChessArgs): ChessBoardType;
