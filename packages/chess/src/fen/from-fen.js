import * as R from 'ramda';

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

const boardFromFEN = R.pipe(R.split('/'), R.map(rowFromFEN));

export const fromFEN = FEN => {
  const [
    piecePlacement,
    activeColor,
    castlingRights,
    enPassant,
    halfMoves,
    fullMoves,
  ] = R.split(' ', FEN);
  return {
    piecePlacement: boardFromFEN(piecePlacement),
    activeColor,
    castlingRights: castlingRights === '-' ? [] : R.split('', castlingRights),
    enPassant: enPassant === '-' ? false : enPassant,
    halfMoves: Number(halfMoves),
    fullMoves: Number(fullMoves),
  };
};
