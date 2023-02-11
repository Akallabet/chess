import * as R from 'ramda';

const fromBoardToPiecePlacement = R.pipe(
  R.map(
    R.pipe(
      R.reduce((row, { piece }) => {
        if (piece) return R.append(piece, row);
        const last = R.last(row);
        if (isNaN(last)) return R.append(1, row);
        return R.append(last + 1, R.dropLast(1, row));
      }, []),
      R.join('')
    )
  ),
  R.join('/')
);

export const toFEN = ({
  board,
  activeColor,
  castlingRights,
  enPassant,
  halfMoves,
  fullMoves,
}) => {
  return `${fromBoardToPiecePlacement(board)} ${activeColor} ${
    castlingRights.length ? R.join('', castlingRights) : '-'
  } ${enPassant || '-'} ${halfMoves} ${fullMoves}`;
};
