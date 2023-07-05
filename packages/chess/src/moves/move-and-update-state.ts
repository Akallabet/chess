import { fromFEN, toFEN } from '../fen.js';
import { colours } from '../constants.js';
import {
  ChessBoardType,
  Coordinates,
  FENState,
  InternalState,
  MoveBase,
} from '../types.js';
import { isActiveColorBlack, isPawn } from '../utils.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.w ? colours.b : colours.w;

const boardWithMove = (
  origin: Coordinates,
  target: Coordinates,
  board: ChessBoardType
) => {
  return board.map((row, y) =>
    row.map(
      (cell, x) => {
        if (y === origin.y && x === origin.x) return {};
        if (y === target.y && x === target.x) return board[origin.y][origin.x];
        return cell;
      },
      [...row]
    )
  );
};

export function moveAndUpdateState(
  move: MoveBase,
  state: InternalState
): InternalState {
  const { origin, target, piece, flags } = move;

  return {
    ...state,
    ...fromFEN(
      toFEN({
        ...state,
        board: boardWithMove(origin, target, state.board),
        activeColor: changeActiveColor(state),
        halfMoves: isPawn(piece) || flags.capture ? 0 : state.halfMoves + 1,
        fullMoves: isActiveColorBlack(state.activeColor)
          ? state.fullMoves + 1
          : state.fullMoves,
      })
    ),
  };
}
