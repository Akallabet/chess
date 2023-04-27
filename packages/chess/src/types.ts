import { modesList } from './constants.js';

export interface Coordinates {
  x: number;
  y: number;
}

type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Files = File[];
export type Ranks = Rank[];

export type Address = `${File}${Rank}`;
export type Position = Coordinates | Address;

export interface EmptySquare {
  capture?: boolean;
  move?: boolean;
  check?: boolean;
}

export interface Square {
  piece?: string;
  selected?: boolean;
  capture?: boolean;
  move?: boolean;
  check?: boolean;
}

export interface MoveCell {
  origin: Coordinates;
  flags: {
    capture: boolean;
    move: boolean;
    check: boolean;
  };
}

export interface Move extends MoveCell {
  coord: Coordinates;
}

export type MoveSquare = MoveCell[];
export type MovesBoardType = MoveSquare[][];

export type ChessBoardType = Array<Array<Square>>;

export type GameMode = (typeof modesList)[number];

export interface MetaData {
  positions: Address[][];
  ranks: Ranks;
  files: Files;
}

export interface ChessInitialState {
  mode: GameMode;
  FEN: string;
}

export interface FENState {
  board: ChessBoardType;
  FEN: string;
  // activeColor: 'w' | 'b';
  activeColor: string;
  castlingRights: '-' | string[];
  enPassant: string | false;
  halfMoves: number;
  fullMoves: number;
}
export interface InternalState extends FENState {
  mode: GameMode;
}

export interface ChessState {
  board?: ChessBoardType;
  movesBoard?: MovesBoardType;
  FEN: string;
  mode: GameMode;
  positions?: Address[][];
  ranks?: Ranks;
  files?: Files;
}

export interface ChessStateOutput extends FENState, MetaData {
  movesBoard: MovesBoardType;
  mode: GameMode;
}
