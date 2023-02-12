import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from './constants.js';
import { generateMoves, mapMovesToBoard } from './moves/index.js';
import { fromFEN } from './fen/index.js';

export const fromChessBoardToCoordinates = pos => {
  const [file, rank] = R.split('', pos);
  return {
    x: files.indexOf(file),
    y: ranks.indexOf(Number(rank)),
  };
};

export const highlightMoves = R.curry((coord, { FEN }) => {
  const state = fromFEN(FEN);
  const isNotCoord = !coord.x || !coord.y;
  const hasNoPiece = !R.hasPath([coord.y, coord.x, 'piece'], state.board);

  const error =
    (isNotCoord && errorCodes.wrongFormat) ||
    (hasNoPiece && errorCodes.no_piece_selected);

  if (error) return R.assoc('error', error, state);

  return R.assoc(
    'board',
    mapMovesToBoard(
      state.board,
      // R.reject(isKingUnderAttack(king, state, coord), moves)
      generateMoves(coord, state)
    ),
    state
  );
});
