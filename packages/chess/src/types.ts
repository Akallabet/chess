import { modes } from './constants.js';

export interface Coordinates {
  x: number;
  y: number;
}

export type Rank = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';
export type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';

export type Files = File[];
export type Ranks = Rank[];

export enum PieceEnum {
  p = 'p',
  n = 'n',
  b = 'b',
  r = 'r',
  q = 'q',
  k = 'k',
  P = 'P',
  N = 'N',
  B = 'B',
  R = 'R',
  Q = 'Q',
  K = 'K',
}
export type BlackPiece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type WhitePiece = 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';
export type Piece = BlackPiece | WhitePiece;
export type PieceType =
  | 'pawn'
  | 'knight'
  | 'bishop'
  | 'rook'
  | 'queen'
  | 'king';
export type ChessBoardAddress = `${File}${Rank}`;

export interface Flags {
  capture?: boolean;
  check?: boolean;
  checkmate?: boolean;
  promotion?: Piece[];
  enPassant?: Coordinates;
  kingSideCastling?: boolean;
  queenSideCastling?: boolean;
}

export type EmptySquare = '';
export type Square = Piece | EmptySquare;

export interface MoveBase extends Flags {
  piece: Piece;
  origin: Coordinates;
  target: Coordinates;
}

export interface Move extends MoveBase {
  san: string[];
}

export interface PGNMove {
  san: string[];
  piece?: Piece;
  origin?: Coordinates;
  target?: Coordinates;
  FEN: string;
  error?: string;
}

export type ChessColor = 'w' | 'b';

export interface CastlingRights {
  w: {
    kingSide: boolean;
    queenSide: boolean;
  };
  b: {
    kingSide: boolean;
    queenSide: boolean;
  };
}

export interface FENStateBase {
  board: Square[][];
  activeColor: ChessColor;
  castlingRights: CastlingRights;
  enPassant: Coordinates | false;
  halfMoves: number;
  fullMoves: number;
}

export interface FENState extends FENStateBase {
  pieceMap: Record<Piece, Array<Coordinates>>;
  opponentColor: ChessColor;
}

export type PGNTag =
  | 'event'
  | 'site'
  | 'date'
  | 'round'
  | 'white'
  | 'black'
  | 'result';

export interface PGNState {
  event?: string;
  site?: string;
  date?: string;
  round?: string;
  white?: string;
  black?: string;
  result?: string;
  initialFEN?: string;
  history?: PGNMove[];
}

export type GameMode = keyof typeof modes;

export type Variant = 'standard' | 'chess960';

export interface ChessStartState extends PGNState {
  mode: GameMode;
  FEN?: string;
  PGN?: string;
  initialFEN?: string;
  currentMove?: number;
}

export interface ChessStartStatePGN extends ChessStartState {
  PGN: string;
}
export interface ChessStartStateFEN extends ChessStartState {
  FEN: string;
}

export interface ChessInitialState extends PGNState {
  mode: GameMode;
  initialFEN: string;
  FEN: string;
  currentMove: number;
  history: PGNMove[];
  error?: string;
}

export interface ChessState extends ChessInitialState, FENState {
  ranks: Ranks;
  files: Files;
  error?: string;
  movesBoard: Move[][][];
  PGN: string;
  history: PGNMove[];
  isBlackWin: boolean;
  isWhiteWin: boolean;
  isGameOver: boolean;
  isCheckmate: boolean;
  isCheck: boolean;
  isStalemate: boolean;
  isInsufficientMaterial: boolean;
  isThreefoldRepetition: boolean;
  isDraw: boolean;
}
