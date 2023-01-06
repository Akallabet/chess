import * as R from 'ramda';
import { errorCodes } from '../error-codes.js';
import { files, ranks } from './constants.js';

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

export const fromChessBoardToCoordinares = pos => {
  const [piece, file, rank] = R.split('', pos);
  return {
    piece,
    x: files.indexOf(file),
    y: ranks.indexOf(Number(rank)),
  };
};
const calcMoves = ({ piece, x, y }, { board }) => {
  console.log({ piece, x, y });
  return { board };
};

export const getMoves = R.curry(
  (pos, game) =>
    (isChessboardPos(pos) &&
      getMoves(fromChessBoardToCoordinares(pos), game)) ||
    (isCoords(pos) && calcMoves(pos, game)) || {
      error: errorCodes.wrongFormat,
      ...game,
    }
);
