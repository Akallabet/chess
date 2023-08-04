import { emptySquare } from '../constants.js';
import {
  CastlingRights,
  ChessColor,
  FENState,
  MoveBase,
  Square,
} from '../types.js';
import {
  isActiveColorBlack,
  isKing,
  isPawn,
  isRook,
  isWhitePiece,
} from '../utils.js';

const changeActiveColor = (activeColor: ChessColor): ChessColor =>
  activeColor === 'w' ? 'b' : 'w';

export function createBoardWithMove(move: MoveBase, board: Square[][]) {
  const boardWithMove = board.map(row => row.map(cell => cell));

  if (move.flags.enPassant) {
    boardWithMove[move.flags.enPassant.y][move.flags.enPassant.x] = emptySquare;
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
  } else if (move.flags.promotion) {
    boardWithMove[move.target.y][move.target.x] = move.flags.promotion;
  } else if (move.flags.kingSideCastling) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
    boardWithMove[move.target.y][5] = boardWithMove[move.target.y][7];
    boardWithMove[move.target.y][7] = emptySquare;
  } else if (move.flags.queenSideCastling) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
    boardWithMove[move.target.y][3] = boardWithMove[move.target.y][0];
    boardWithMove[move.target.y][0] = emptySquare;
  } else if (move.flags.capture || move.flags.move) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
  }

  boardWithMove[move.origin.y][move.origin.x] = emptySquare;
  return boardWithMove;
}

function calcEnPassant(move: MoveBase) {
  const enPassantRank = isWhitePiece(move.piece)
    ? move.target.y + 1
    : move.target.y - 1;
  return (
    isPawn(move.piece) &&
    Math.abs(move.target.y - move.origin.y) === 2 && {
      y: enPassantRank,
      x: move.target.x,
    }
  );
}

function calcCastlingRights(
  move: MoveBase,
  board: Square[][],
  activeColor: string,
  castlingRights: CastlingRights
) {
  const isCastlingMove =
    move.flags.kingSideCastling || move.flags.queenSideCastling;
  return {
    w: {
      kingSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === board[0].length - 1)) &&
        activeColor === 'w'
          ? false
          : castlingRights.w.kingSide,
      queenSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === 0)) &&
        activeColor === 'w'
          ? false
          : castlingRights.w.queenSide,
    },
    b: {
      kingSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === board[0].length - 1)) &&
        activeColor === 'b'
          ? false
          : castlingRights.b.kingSide,
      queenSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === 0)) &&
        activeColor === 'b'
          ? false
          : castlingRights.b.queenSide,
    },
  };
}

export function updateFENStateWithMove(
  move: MoveBase,
  board: Square[][],
  activeColor: ChessColor,
  castlingRights: CastlingRights,
  halfMoves: number,
  fullMoves: number
): FENState {
  return {
    castlingRights: calcCastlingRights(
      move,
      board,
      activeColor,
      castlingRights
    ),
    board: createBoardWithMove(move, board),
    activeColor: changeActiveColor(activeColor),
    halfMoves: isPawn(move.piece) || move.flags.capture ? 0 : halfMoves + 1,
    fullMoves: isActiveColorBlack(activeColor) ? fullMoves + 1 : fullMoves,
    enPassant: calcEnPassant(move),
  };
}
