import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, modes, modesList, ranks } from './constants.js';
import {
  generateMoves,
  isCellUnderCheck,
  mapMovesToBoard,
} from './moves/index.js';
import { move } from './move.js';
import { fromFEN } from './fen/index.js';
import { getPieceCoord } from './utils/index.js';

const getKingPiece = ({ activeColor }) => (activeColor === 'w' ? 'K' : 'k');

const isKingUnderAttack = (origin, state) => {
  const kingCoord = getPieceCoord(getKingPiece(state), state.board);
  return target => {
    return isCellUnderCheck(kingCoord, move(origin, target.coord, state));
  };
};

const modesMap = {
  [modes.standard]: { rejectMoves: isKingUnderAttack },
  [modes.demo]: { rejectMoves: () => R.F },
  [modes.practice]: { rejectMoves: () => R.F },
};

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
