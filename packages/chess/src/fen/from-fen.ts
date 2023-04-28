import * as R from 'ramda';
import { ChessBoardType, FENState } from '../types.js';

export const emptyCell = {};
const addEmptyCells = n => {
  const cells = [];
  for (let i = 0; i < n; i++) {
    cells.push(emptyCell);
  }
  return cells;
};

function boardFromFEN(FEN: string): ChessBoardType {
  const FENRows = R.split('/', FEN);
  const board = [];
  for (let i = 0; i < FENRows.length; i++) {
    const elements = FENRows[i].split('');
    const row = [];
    for (let j = 0; j < elements.length; j++) {
      if (isNaN(Number(elements[j]))) {
        row.push({ piece: elements[j] });
      } else {
        row.push(...addEmptyCells(Number(elements[j])));
      }
    }
    board.push(row);
  }
  return board;
}

export function fromFEN(FEN: string): FENState {
  const [
    piecePlacement,
    activeColor,
    castlingRights,
    enPassant,
    halfMoves,
    fullMoves,
  ] = FEN.split(' ');
  return {
    FEN,
    board: boardFromFEN(piecePlacement),
    activeColor,
    castlingRights: castlingRights === '-' ? [] : R.split('', castlingRights),
    enPassant: enPassant === '-' ? false : enPassant,
    halfMoves: Number(halfMoves),
    fullMoves: Number(fullMoves),
  };
}
