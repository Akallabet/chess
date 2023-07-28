import * as R from 'ramda';
import { files, ranks } from './constants.js';
import { ChessBoardType, EmptySquare, FENState, Square } from './types.js';
import { isBlackPiece, isWhitePiece } from './utils.js';

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
    castlingRights:
      castlingRights === '-'
        ? {
            w: { kingSide: false, queenSide: false },
            b: { kingSide: false, queenSide: false },
          }
        : {
            w: {
              kingSide: castlingRights.includes('K'),
              queenSide: castlingRights.includes('Q'),
            },
            b: {
              kingSide: castlingRights.includes('k'),
              queenSide: castlingRights.includes('q'),
            },
          },
    enPassant:
      enPassant === '-'
        ? false
        : {
            y: ranks.indexOf(Number(enPassant[1])),
            x: files.indexOf(enPassant[0]),
          },
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
    (castlingRights.w.kingSide ? 'K' : '') +
      (castlingRights.w.queenSide ? 'Q' : '') +
      (castlingRights.b.kingSide ? 'k' : '') +
      (castlingRights.b.queenSide ? 'q' : '') || '-'
  } ${
    enPassant ? `${files[enPassant.x]}${ranks[enPassant.y]}` : '-'
  } ${halfMoves} ${fullMoves}`;
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
