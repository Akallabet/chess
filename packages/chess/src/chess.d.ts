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
  selected: boolean;
}
export interface Move {
  origin: Coordinates;
  flags: {
    capture: boolean;
    move: boolean;
    check: boolean;
  };
}
export type MoveSquare = Move[];
export type MovesBoardType = MoveSquare[][];

type Positions = Address[][];
export type ChessBoardType = Square[][];

export type GameMode = typeof modesList[number];

export interface ChessState {
  board?: ChessBoardType;
  movesBoard?: MovesBoardType;
  FEN: string;
  mode: GameMode;
  positions?: Positions;
  ranks?: Ranks[];
  files?: Files[];
}

export interface ChessStateOutput {
  board: ChessBoardType;
  movesBoard: MovesBoardType;
  FEN: string;
  mode: GameMode;
  positions: Positions;
  ranks: Ranks[];
  files: Files[];
}
export default function chess(cmd: 'start', args: ChessState): ChessStateOutput;
export default function chess(cmd: 'clear', args: ChessState): ChessStateOutput;
export default function chess(
  cmd: 'clear'
): (args: ChessState) => ChessStateOutput;
export default function chess(
  cmd: 'move',
  origin: Position,
  target: Position,
  args: ChessState
): ChessStateOutput;
export default function chess(
  cmd: 'move',
  origin: Position,
  target: Position
): (args: ChessState) => ChessStateOutput;
export default function chess(
  cmd: 'highlight',
  SAN: string,
  args: ChessState
): ChessStateOutput;
export default function chess(
  cmd: 'highlight',
  coords: Position,
  args: ChessState
): ChessStateOutput;
export default function chess(
  cmd: 'highlight',
  SAN: string
): (args: ChessState) => ChessStateOutput;
export default function chess(
  cmd: 'highlight',
  coords: Position
): (args: ChessState) => ChessStateOutput;
