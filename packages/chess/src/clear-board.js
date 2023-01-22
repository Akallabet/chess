import * as R from 'ramda';
import { fromFEN } from './fen/index.js';

export const clearBoard = R.pipe(R.prop('FEN'), fromFEN);
