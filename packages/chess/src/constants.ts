import type { Files, Ranks } from './types.js';

export const files: Files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks: Ranks = [8, 7, 6, 5, 4, 3, 2, 1];
export const colours = { w: 'w', b: 'b' };
export const blackPieces = 'pnbrqk';
export const whitePieces = 'PNBRQK';
export const pieces = `${blackPieces}${whitePieces}`;
export const piecesMap = {
  p: 'p',
  n: 'n',
  b: 'b',
  r: 'r',
  q: 'q',
  k: 'k',
  P: 'P',
  N: 'N',
  B: 'B',
  R: 'R',
  Q: 'Q',
  K: 'K',
};
export const flags = {
  capture: 'capture',
  move: 'move',
  selected: 'selected',
  check: 'check',
  promotion: 'promotion',
};
export const modes = {
  standard: 'standard',
  practice: 'practice',
  demo: 'demo',
};
