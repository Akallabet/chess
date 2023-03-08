import { start } from './start';
import { move } from './move.js';
import { highlightMoves } from './highlight-moves.js';
import { clearBoard } from './clear-board.js';
import { files, ranks } from './constants.js';

const cmds = {
  start,
  move,
  highlight: highlightMoves,
  clear: clearBoard,
  files,
  ranks,
};

const chess = (cmd, ...args) => cmds[cmd](...args);
export default chess;
export { files, ranks } from './constants.js';
