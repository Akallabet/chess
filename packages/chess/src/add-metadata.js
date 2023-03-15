import * as R from 'ramda';
import { files, ranks } from './constants.js';
import { getPositions } from './get-positions.js';

export const addMetaData = R.pipe(
  R.assoc('positions', getPositions(files, ranks)),
  R.assoc('ranks', ranks),
  R.assoc('files', files)
);
