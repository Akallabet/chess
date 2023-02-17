import * as R from 'ramda';
import { fromFEN } from './fen/index.js';

export const start = ({ FEN, ...rest }) => R.mergeRight(rest, fromFEN(FEN));
