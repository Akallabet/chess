import { start } from './start';
import { getMoves } from './get-moves.js';
import { clearBoard } from './clear-board.js';
import { files, ranks } from './constants.js';

const chess = {
  start,
  getMoves,
  clearBoard,
  files,
  ranks,
};
export default chess;
