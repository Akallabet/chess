export interface Square {
  piece: string;
}

export type ChessBoardType = Square[][];

export interface ChessArgs {
  board: ChessBoardType;
}

export function start(args: string | ChessArgs): ChessArgs;
