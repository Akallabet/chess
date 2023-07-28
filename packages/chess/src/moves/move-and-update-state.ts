import { fromFEN, toFEN } from '../fen.js';
import { colours } from '../constants.js';
import { ChessBoardType, FENState, InternalState, MoveBase } from '../types.js';
import { isActiveColorBlack, isPawn, isWhitePiece } from '../utils.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.w ? colours.b : colours.w;

export function createBoardWithMove(move: MoveBase, board: ChessBoardType) {
  const boardWithMove = board.map(row => row.map(cell => ({ ...cell })));
  return boardWithMove.map((row, y) =>
    row.map(
      (cell, x) => {
        if (y === move.origin.y && x === move.origin.x) return {};
        if (y === move.target.y && x === move.target.x) {
          if (move.flags.promotion) {
            return {
              piece: move.flags.promotion,
            };
          }
          if (move.flags.enPassant) {
            boardWithMove[move.flags.enPassant.y][move.flags.enPassant.x] = {};
          }
          return boardWithMove[move.origin.y][move.origin.x];
        }
        return cell;
      },
      [...row]
    )
  );
}

function calcEnPassantRank(move: MoveBase) {
  return isWhitePiece(move.piece) ? move.target.y + 1 : move.target.y - 1;
}

export function moveAndUpdateState(
  move: MoveBase,
  state: InternalState
): InternalState {
  return {
    ...state,
    ...fromFEN(
      toFEN({
        ...state,
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
