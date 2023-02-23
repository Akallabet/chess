import * as R from 'ramda';
import { fromFEN } from './fen/index.js';

export const start = ({ FEN, ...state }) => R.mergeRight(state, fromFEN(FEN));
