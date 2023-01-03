import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';

const isPiece = piece => new RegExp(/[pnbrqkPNBRQK]+/).test(piece);
const isChessboardPos = pos =>
  new RegExp(/([pnbrqkPNBRQK]+[a-h]+[1-8]+)/).test(pos);
const isCoords = pos =>
  R.has('piece', pos) &&
  R.has('x', pos) &&
  R.has('y', pos) &&
  isPiece(pos.piece) &&
  R.gte(pos.x, 1) &&
  R.lte(pos.x, 8) &&
  R.gte(pos.y, 1) &&
  R.lte(pos.y, 8);

const getMovesFromChessboardPos = (pos, { board }) => ({ board });
const getMovesFromCoordinates = ({ piece, x, y }, { board }) => ({ board });

export const getMoves = R.curry(
  (pos, game) =>
    (isChessboardPos(pos) && getMovesFromChessboardPos(pos, game)) ||
    (isCoords(pos) && getMovesFromCoordinates(pos, game)) || {
      error: errorCodes.wrongFormat,
      ...game,
    }
);
