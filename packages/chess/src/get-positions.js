import * as R from 'ramda';

export const getPositions = (files, ranks) =>
  R.map(rank => R.map(file => `${file}${rank}`, files), ranks);
