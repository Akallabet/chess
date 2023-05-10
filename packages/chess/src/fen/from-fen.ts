import * as R from 'ramda';
import { ChessBoardType, EmptySquare, FENState, Square } from '../types.js';

export const emptyCell = {};
const addEmptyCells = (n: number): Array<EmptySquare> => {
  const cells = [];
  for (let i = 0; i < n; i++) {
    cells.push(emptyCell);
  }
  return cells;
};

export function rowFromFEN(FENRow: string): Array<Square> {
  const elements = FENRow.split('');
  const row = [];
  for (let i = 0; i < elements.length; i++) {
    if (isNaN(Number(elements[i]))) {
      row.push({ piece: elements[i] });
    } else {
      row.push(...addEmptyCells(Number(elements[i])));
    }
  }
  return row;
}

function boardFromFEN(FEN: string): ChessBoardType {
  const FENRows = R.split('/', FEN);
  const board = [];
  for (let i = 0; i < FENRows.length; i++) {
    board.push(rowFromFEN(FENRows[i]));
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
