interface Coordinates {
  x: number;
  y: number;
}

export interface Square {
  piece: string;
  move: boolean;
  capture: boolean;
  selected: boolean;
}

export type ChessBoardType = Square[][];

export interface ChessState {
  board: ChessBoardType | undefined;
  FEN: string;
}
interface StartArgs {
  FEN: string;
}
export const files: string[];
export const ranks: string[];
export default function chess(cmd: string, args: ChessState): ChessState;
export default function chess(cmd: 'start', args: StartArgs): ChessState;
export default function chess(
  cmd: 'highlight',
  SAN: string,
  args: ChessState
): ChessState;
export default function chess(
  cmd: 'highlight',
  coords: Coordinates,
  args: ChessState
): ChessState;
export default function chess(
  cmd: 'highlight',
  SAN: string
): (args: ChessState) => ChessState;
export default function chess(
  cmd: 'highlight',
  coords: Coordinates
): (args: ChessState) => ChessState;
