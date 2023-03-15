import * as R from 'ramda';
import { addMetaData } from './add-metadata.js';
import { fromFEN } from './fen/index.js';

export const clearBoard = R.pipe(R.prop('FEN'), fromFEN, addMetaData);
