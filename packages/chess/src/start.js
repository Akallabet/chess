import * as R from 'ramda';
import { fromFEN, isFEN } from './fen/index.js';

const startWithFEN = FEN => {
  const { piecePlacement } = fromFEN(FEN);
  return {
    board: piecePlacement,
  };
};

export const start = config => {
  if (isFEN(config)) return startWithFEN(config);
};
