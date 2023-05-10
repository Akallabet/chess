import { toFEN } from '../fen/index.js';
import { colours } from '../constants.js';
import {
  ChessBoardType,
  Coordinates,
  FENState,
  InternalState,
} from '../types.js';

const changeActiveColor = (state: FENState) =>
  state.activeColor === colours.white ? colours.black : colours.white;

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

export const moveAndUpdateState = (
  origin: Coordinates,
  target: Coordinates,
  state: InternalState
): InternalState => {
  const board = boardWithMove(origin, target, state.board);
  const activeColor = changeActiveColor(state);
  const FEN = toFEN({ ...state, board, activeColor });

  return {
    ...state,
    board,
    activeColor,
    FEN,
  };
};