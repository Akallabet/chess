import * as R from 'ramda';

export const fromFEN = FEN => {
  const [pieces, activeColor, castlingRights, enPassant, halfMoves] = R.split(
    ' ',
    FEN
  );
  return {
    activeColor,
    castlingRights: castlingRights === '-' ? [] : R.split('', castlingRights),
    enPassant: enPassant === '-' ? false : enPassant,
    halfMoves: Number(halfMoves),
  };
};
