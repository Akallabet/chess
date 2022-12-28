import * as R from 'ramda';

const emptyCell = '';
const addEmptyCells = n => {
  const cells = [];
  for (let i = 0; i < Number(n); i++) {
    cells.push(emptyCell);
  }
  console.log();
  return cells;
};

export const rowFromFEN = R.pipe(
  R.split(''),
  R.map(R.ifElse(isNaN, R.identity, addEmptyCells)),
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
