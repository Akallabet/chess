import { start } from './start';
import { getMoves } from './get-moves.js';
import { clearBoard } from './clear-board.js';
import { files, ranks } from './constants.js';

const cmds = {
  start,
  highlight: getMoves,
  clear: clearBoard,
  files,
  ranks,
};

const chess = (cmd, args) => cmds[cmd](args);
export default chess;
