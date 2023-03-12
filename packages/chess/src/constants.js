export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
export const colours = { white: 'w', black: 'b' };
export const blackPieces = 'pnbrqk';
export const whitePieces = 'PNBRQK';
export const pieces = `${blackPieces}${whitePieces}`;
export const piecesMap = {
  [colours.white]: whitePieces,
  [colours.black]: blackPieces,
};
export const flags = {
  capture: 'capture',
  move: 'move',
  selected: 'selected',
  check: 'check',
};
export const modes = {
  standard: 'standard',
  practice: 'practice',
  demo: 'demo',
};
export const modesList = Object.keys(modes);
