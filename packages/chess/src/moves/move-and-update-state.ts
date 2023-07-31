import { colours } from '../constants.js';
import {
  CastlingRights,
  ChessBoardType,
  FENState,
  MoveBase,
} from '../types.js';
import {
  isActiveColorBlack,
  isKing,
  isPawn,
  isRook,
  isWhitePiece,
} from '../utils.js';

const changeActiveColor = (activeColor: string) =>
  activeColor === colours.w ? colours.b : colours.w;

export function createBoardWithMove(move: MoveBase, board: ChessBoardType) {
  const boardWithMove = board.map(row => row.map(cell => ({ ...cell })));

  if (move.flags.enPassant) {
    boardWithMove[move.flags.enPassant.y][move.flags.enPassant.x] = {};
    boardWithMove[move.target.y][move.target.x] = {
      ...boardWithMove[move.origin.y][move.origin.x],
    };
  } else if (move.flags.promotion) {
    boardWithMove[move.target.y][move.target.x] = {
      piece: move.flags.promotion,
    };
  } else if (move.flags.kingSideCastling) {
    boardWithMove[move.target.y][move.target.x] = {
      ...boardWithMove[move.origin.y][move.origin.x],
    };
    boardWithMove[move.target.y][5] = {
      ...boardWithMove[move.target.y][7],
    };
    boardWithMove[move.target.y][7] = {};
  } else if (move.flags.queenSideCastling) {
    boardWithMove[move.target.y][move.target.x] = {
      ...boardWithMove[move.origin.y][move.origin.x],
    };
    boardWithMove[move.target.y][3] = {
      ...boardWithMove[move.target.y][0],
    };
    boardWithMove[move.target.y][0] = {};
  } else if (move.flags.capture || move.flags.move) {
    boardWithMove[move.target.y][move.target.x] = {
      ...boardWithMove[move.origin.y][move.origin.x],
    };
  }

  boardWithMove[move.origin.y][move.origin.x] = {};
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
  board: ChessBoardType,
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
  board: ChessBoardType,
  activeColor: string,
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
