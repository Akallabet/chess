import { modes, piecesMap } from './constants.js';

const piecesList = Object.keys(piecesMap);
export interface Coordinates {
  x: number;
  y: number;
}

type Rank = number; // 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type File = string; // 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
export type Files = File[];
export type Ranks = Rank[];

export type Piece = (typeof piecesList)[number];

export type Address = string;
export type Position = Coordinates | Address;

export interface EmptySquare {
  capture?: boolean;
  move?: boolean;
  check?: boolean;
}

export interface Square extends EmptySquare {
  piece?: Piece;
  selected?: boolean;
}

export interface MoveState {
  step: number;
  current: Coordinates;
  origin: Coordinates;
  state: InternalState;
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
  piece: Piece;
  coord: Coordinates;
  san: string;
}

export type MoveSquare = Move[];
export type MovesBoardType = MoveSquare[][];

export type ChessBoardType = Array<Array<Square>>;

export type GameMode = keyof typeof modes;

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
  error?: string;
}

export interface ChessState extends InternalState, MetaData {
  movesBoard: MovesBoardType;
}
