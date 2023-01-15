import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from './constants.js';
import { getPieceMoves } from './moves/index.js';
import { fromFEN } from './fen/index.js';

const isPiece = piece => new RegExp(/[pnbrqkPNBRQK]+/).test(piece);
const isChessboardPos = pos =>
  new RegExp(/([pnbrqkPNBRQK]+[a-h]+[1-9]+)/).test(pos);

const isCoords = pos =>
  R.has('piece', pos) &&
  R.has('x', pos) &&
  R.has('y', pos) &&
  isPiece(pos.piece) &&
  R.gte(pos.x, 0) &&
  R.lte(pos.x, 7) &&
  R.gte(pos.y, 0) &&
  R.lte(pos.y, 7);

export const fromChessBoardToCoordinates = pos => {
  const [piece, file, rank] = R.split('', pos);
  return {
    piece,
    x: files.indexOf(file),
    y: ranks.indexOf(Number(rank)),
  };
};
const calcMoves = ({ piece, x, y }, { board, ...rest }) => {
  return { board: getPieceMoves(piece, { x, y }, { board }), ...rest };
};

export const getMoves = R.curry((pos, state) => {
  if (isChessboardPos(pos)) {
    return getMoves(fromChessBoardToCoordinates(pos), state);
  }
  if (isCoords(pos)) return calcMoves(pos, fromFEN(R.prop('FEN', state)));
  return {
    error: errorCodes.wrongFormat,
    ...state,
  };
});
