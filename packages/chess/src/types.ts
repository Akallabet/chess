import { modesList } from './constants.js';

export interface Coordinates {
  x: number;
  y: number;
}

type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Files = File[];
export type Ranks = Rank[];

export type Address = `${string & keyof File}${string & keyof Rank}`;
export type Position = Coordinates | Address;

export interface EmptySquare {
  capture?: boolean;
  move?: boolean;
  check?: boolean;
}

export interface Square extends EmptySquare {
  piece?: string;
  selected?: boolean;
}

export interface MoveCell {
  origin: Coordinates;
  flags: {
    capture?: boolean;
    move?: boolean;
    check?: boolean;
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

export interface InternalState extends ChessInitialState, FENState {
  mode: GameMode;
}

export interface ChessState extends InternalState, MetaData {
  movesBoard: MovesBoardType;
}
