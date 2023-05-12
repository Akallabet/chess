import * as R from 'ramda';
import { ChessBoardType, EmptySquare, FENState, Square } from './types.js';
import { isBlackPiece, isWhitePiece } from './utils/index.js';

const addEmptyCells = (n: number): Array<EmptySquare> => {
  const cells = [];
  for (let i = 0; i < n; i++) {
    cells.push({});
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

export const toFEN = ({
  board,
  activeColor,
  castlingRights,
  enPassant,
  halfMoves,
  fullMoves,
}: FENState) => {
  const piecePlacement = board
    .map(boardRow =>
      boardRow
        .reduce((row: Array<string | number>, cell) => {
          const last = row[row.length - 1];
          if (cell.piece) row.push(cell.piece);
          else if (typeof last === 'number') row[row.length - 1] = last + 1;
          else row.push(1);
          return row;
        }, [])
        .join('')
    )
    .join('/');

  return `${piecePlacement} ${activeColor} ${
    Array.isArray(castlingRights) ? castlingRights.join('') : '-'
  } ${enPassant || '-'} ${halfMoves} ${fullMoves}`;
};

const FENRegExp = new RegExp(
  /^((([pnbrqkPNBRQK1-8]{1,8})\/?){8})\s+(b|w)\s+(-|K?Q?k?q)\s+(-|[a-h][3-6])\s+(\d+)\s+(\d+)\s*$/
);

export function isFEN(FEN: string) {
  return (
    FENRegExp.test(FEN) &&
    FEN.split(' ')[0]
      .split('/')
      .every(row => rowFromFEN(row).length === 8)
  );
}

export const getCastlingRights = (
  king: string,
  state: { castlingRights: '-' | string[] }
) => {
  const { castlingRights } = state;
  if (!castlingRights.length) return { kingSide: false, queenSide: false };
  if (isWhitePiece(king))
    return {
      kingSide: R.includes('K', castlingRights),
      queenSide: R.includes('Q', castlingRights),
    };
  if (isBlackPiece(king)) {
    return {
      kingSide: R.includes('k', castlingRights),
      queenSide: R.includes('q', castlingRights),
    };
  }
  return { kingSide: false, queenSide: false };
};
