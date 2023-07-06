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

export interface Flags {
  capture?: boolean;
  move?: boolean;
  check?: boolean;
  checkmate?: boolean;
  promotion?: string;
}

export type EmptySquare = Record<string, never>;

export interface Square {
  piece?: Piece;
}

export interface MoveBase {
  piece: Piece;
  origin: Coordinates;
  target: Coordinates;
  flags: Flags;
}

export interface Move extends MoveBase {
  san: Array<string>;
}

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
  movesBoard: Array<Array<Array<Move>>>;
  isGameOver: boolean;
  isDraw: boolean;
}
