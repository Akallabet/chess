import * as R from 'ramda';

export const getMoves = R.curry((pos, { board }) => {
  console.log(pos);
  return board;
});
