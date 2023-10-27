
import { piecesMap } from './constants.js';
import {
  getBoardStateFromFEN,
} from './fen.js';
import {
  ChessInitialState,
  Square,
  Piece,
} from './types.js';

import { getPieceCoord, isBlackPiece, isWhitePiece } from './utils.js';

export function calcInsufficientMaterial(board: Square[][]): boolean {
  const pieces: Piece[] = board
    .flat()
    .filter(square => square !== '')
    .map(piece => piece as Piece); //Why TypeScript can't infer that piece is Piece?

  const whitePieces = pieces.filter(isWhitePiece);
  const blackPieces = pieces.filter(isBlackPiece);
  if (whitePieces.length === 1 && blackPieces.length === 1) return true;
  if (whitePieces.length === 1 && blackPieces.length === 2) {
    return Boolean(
      blackPieces.find(piece => piece === piecesMap.b || piece === piecesMap.n)
    );
  }
  if (blackPieces.length === 1 && whitePieces.length === 2) {
    return Boolean(
      whitePieces.find(piece => piece === piecesMap.B || piece === piecesMap.N)
    );
  }
  if (whitePieces.length === 2 && blackPieces.length === 2) {
    // Two bishops on the same color
    // https://en.wikipedia.org/wiki/Chess_endgame#Two_bishops
    // https://www.chessprogramming.org/Two_Bishops_Endgame
    const whiteBishopCoord = getPieceCoord(piecesMap.B, board);
    const blackBishopCoord = getPieceCoord(piecesMap.b, board);
    if (!whiteBishopCoord || !blackBishopCoord) return false;
    // calculate if white bishop and black bishop are on the same color
    return (
      (whiteBishopCoord.x + whiteBishopCoord.y) % 2 === 0 &&
      (blackBishopCoord.x + blackBishopCoord.y) % 2 === 0
    );
  }
  return false;
}

export function calcThreefoldRepetition(state: ChessInitialState): boolean {
  if (state.moves.length < 3) return false;
  const current = state.moves[state.moves.length - 1];
  const currentBoardState = getBoardStateFromFEN(current.FEN);

  const repeatedMoves = state.moves.filter(
    ({ FEN }) => getBoardStateFromFEN(FEN) === currentBoardState
  );
  return repeatedMoves.length === 3;
}
