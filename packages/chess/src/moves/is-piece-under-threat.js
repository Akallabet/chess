import * as R from 'ramda';
import { flags } from '../constants.js';
import { areOpponents } from '../utils/index.js';
import { highlightMoves } from './moves.js';
//Loop through each row
//Loop through each cell
//If there is a piece and it's opponent
//  then get all the moves for that piece
//    for each move
//      if at least one matches coord
//        then return true
//return false otherwise

const canPieceMoveToCell = R.curryN(2, (flag, a, b, state) => {
  const moves = highlightMoves(a, state);
  return Boolean(moves[b.y][b.x][flag]);
});

export const canPieceThreathenCell = canPieceMoveToCell(flags.capture);

const isCellInMoves = flag =>
  R.curry((coord, state) => {
    const { board } = state;
    const target = board[coord.y][coord.x];
    for (let y = 0; y < board.length - 1; y++) {
      for (let x = 0; x < board[y].length - 1; x++) {
        if (
          board[y][x].piece &&
          areOpponents(target.piece, board[y][x].piece) &&
          canPieceMoveToCell(flag, { y, x }, coord, state)
        )
          return true;
      }
    }
    return false;
  });

export const isPieceUnderThreat = isCellInMoves(flags.capture);
