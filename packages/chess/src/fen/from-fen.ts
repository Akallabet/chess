import * as R from 'ramda';
import { ChessBoardType, FENObject } from '../types.js';

export const emptyCell = {};
const addEmptyCells = n => {
  const cells = [];
  for (let i = 0; i < n; i++) {
    cells.push(emptyCell);
  }
  return cells;
};

const addCell = piece => ({ piece });

export const rowFromFEN = R.pipe(
  R.split(''),
  R.map(
    R.ifElse(R.pipe(Number, isNaN), addCell, R.pipe(Number, addEmptyCells))
  ),
  R.flatten
);

function boardFromFEN(FEN: string): ChessBoardType {
  const FENRows = R.split('/', FEN);
  const board = [];
  for (let i = 0; i < FENRows.length; i++) {
    const elements = FENRows[i].split('');
    const row = [];
    for (let j = 0; j < elements.length; j++) {
      const element = Number(elements[j]);
      if (isNaN(element)) {
        row.push({ piece: element });
      } else {
        row.push(...addEmptyCells(element));
      }
    }
    board.push(row);
  }
  return board;
}

export function fromFEN(FEN: string): FENObject {
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
