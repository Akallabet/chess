import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, modesList, ranks } from './constants.js';
import { generateMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';
import { modesMap } from './modes.js';

export const fromChessBoardToCoordinates = pos => {
  const [file, rank] = R.split('', pos);
  return {
    x: files.indexOf(file),
    y: ranks.indexOf(Number(rank)),
  };
};

export const highlightMoves = R.curry((coord, { FEN, ...initialState }) => {
  const state = R.mergeRight(initialState, fromFEN(FEN));
  const isNotCoord = !R.has('x', coord) || !R.has('y', coord);
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  const error =
    (isNotCoord && errorCodes.wrongFormat) ||
    (hasNoPiece && errorCodes.no_piece_selected);

  if (error) return R.assoc('error', error, state);

  const rejectMoves = R.path(
    [state.mode || modesList[0], 'rejectMoves'],
    modesMap
  );

  const moves = generateMoves(coord, state, rejectMoves);
  const boardWithHighlights = mapMovesToBoard(state.board, moves);
  return R.assoc('board', boardWithHighlights, state);
});
