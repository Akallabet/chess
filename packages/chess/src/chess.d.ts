import { modesList } from './constants.js';

interface Coordinates {
  x: number;
  y: number;
}

type Ranks = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type Files = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
type Address = `${Files}${Ranks}`;
export type Position = Coordinates | Address;

export interface Square {
  piece: string;
  move: boolean;
  capture: boolean;
  selected: boolean;
}

export type ChessBoardType = Square[][];

export type GameMode = typeof modesList[number];

export interface ChessState {
  board?: ChessBoardType | undefined;
  FEN: string;
  mode: GameMode;
}
export const files: string[];
export const ranks: string[];
export default function chess(cmd: 'start', args: ChessState): ChessState;
export default function chess(cmd: 'clear', args: ChessState): ChessState;
export default function chess(cmd: 'clear'): (args: ChessState) => ChessState;
export default function chess(
  cmd: 'move',
  origin: Position,
  target: Position,
  args: ChessState
): ChessState;
export default function chess(
  cmd: 'move',
  origin: Position,
  target: Position
): (args: ChessState) => ChessState;
export default function chess(
  cmd: 'highlight',
  SAN: string,
  args: ChessState
): ChessState;
export default function chess(
  cmd: 'highlight',
  coords: Position,
  args: ChessState
): ChessState;
export default function chess(
  cmd: 'highlight',
  SAN: string
): (args: ChessState) => ChessState;
export default function chess(
  cmd: 'highlight',
  coords: Position
): (args: ChessState) => ChessState;
