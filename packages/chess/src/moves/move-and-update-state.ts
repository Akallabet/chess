import { fromFEN, toFEN } from '../fen.js';
import { colours } from '../constants.js';
import { ChessBoardType, FENState, InternalState, MoveBase } from '../types.js';
import { isActiveColorBlack, isPawn, isWhitePiece } from '../utils.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.w ? colours.b : colours.w;

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

function calcEnPassantRank(move: MoveBase) {
  return isWhitePiece(move.piece) ? move.target.y + 1 : move.target.y - 1;
}

export function moveAndUpdateState(
  move: MoveBase,
  state: InternalState
): InternalState {
  const isCastlingMove =
    move.flags.kingSideCastling || move.flags.queenSideCastling;
  return {
    ...state,
    ...fromFEN(
      toFEN({
        ...state,
        castlingRights: {
          w: {
            kingSide:
              isCastlingMove && state.activeColor === 'w'
                ? false
                : state.castlingRights.w.kingSide,
            queenSide:
              isCastlingMove && state.activeColor === 'w'
                ? false
                : state.castlingRights.w.queenSide,
          },
          b: {
            kingSide:
              isCastlingMove && state.activeColor === 'b'
                ? false
                : state.castlingRights.b.kingSide,
            queenSide:
              isCastlingMove && state.activeColor === 'b'
                ? false
                : state.castlingRights.b.queenSide,
          },
        },
        board: createBoardWithMove(move, state.board),
        activeColor: changeActiveColor(state),
        halfMoves:
          isPawn(move.piece) || move.flags.capture ? 0 : state.halfMoves + 1,
        fullMoves: isActiveColorBlack(state.activeColor)
          ? state.fullMoves + 1
          : state.fullMoves,
        enPassant: isPawn(move.piece) &&
          Math.abs(move.target.y - move.origin.y) === 2 && {
            y: calcEnPassantRank(move),
            x: move.target.x,
          },
      })
    ),
  };
}
