import { fromFEN, toFEN } from '../fen.js';
import { colours } from '../constants.js';
import { ChessBoardType, FENState, InternalState, MoveBase } from '../types.js';
import { isActiveColorBlack, isPawn } from '../utils.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.w ? colours.b : colours.w;

export function boardWithMove(move: MoveBase, board: ChessBoardType) {
  const { origin, target, flags } = move;
  return board.map((row, y) =>
    row.map(
      (cell, x) => {
        if (y === origin.y && x === origin.x) return {};
        if (y === target.y && x === target.x) {
          if (flags.promotion) {
            return {
              piece: 'Q',
            };
          }
          return board[origin.y][origin.x];
        }
        return cell;
      },
      [...row]
    )
  );
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
        board: boardWithMove(move, state.board),
        activeColor: changeActiveColor(state),
        halfMoves:
          isPawn(move.piece) || move.flags.capture ? 0 : state.halfMoves + 1,
        fullMoves: isActiveColorBlack(state.activeColor)
          ? state.fullMoves + 1
          : state.fullMoves,
      })
    ),
  };
}
