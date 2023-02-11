import * as R from 'ramda';
import { rotate } from './rotate.js';

export const withRotatedBoard = fn => (coord, state) =>
  R.pipe(
    rotate,
    board => fn({ x: 7 - coord.x, y: 7 - coord.y }, { board }),
    rotate
  )(state.board);
