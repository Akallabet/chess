import * as R from 'ramda';
import { addMetaData } from './add-metadata.js';
import { fromFEN } from './fen/index.js';

export const start = R.pipe(
  ({ FEN, ...state }) => R.mergeRight(state, fromFEN(FEN)),
  addMetaData
);
