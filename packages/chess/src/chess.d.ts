export interface Square {
  piece: string;
  move: boolean;
  capture: boolean;
  selected: boolean;
}

export type ChessBoardType = Square[][];

export interface ChessState {
  board: ChessBoardType;
  FEN: string;
}
interface StartArgs {
  FEN: string;
}
export const files: string[];
export const ranks: string[];
export function start(args: StartArgs): ChessState;
export function getMoves(SAN: string): (args: ChessState) => ChessState;
export function getMoves(SAN: string, args: ChessState): ChessState;
