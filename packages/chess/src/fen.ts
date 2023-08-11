import {
  blackPieces,
  colours,
  emptySquare,
  files,
  piecesMap,
  positions,
  ranks,
  whitePieces,
} from './constants.js';
import { errorCodes } from './error-codes.js';
import {
  ChessBoardAddress,
  FENState,
  Rank,
  File,
  Square,
  Piece,
} from './types.js';

export function rowFromFEN(FENRow: string): Square[] {
  const elements = FENRow.split('');
  const row: Square[] = [];
  for (const element of elements) {
    if (piecesMap[element as Piece]) {
      row.push(element as Piece);
    } else {
      for (let i = 0; i < Number(element); i++) {
        row.push(emptySquare);
      }
    }
  }
  return row;
}

function boardFromFEN(piacePlacement: string): Square[][] {
  return piacePlacement.split('/').map(rowFromFEN);
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

  const isValidFEN =
    (activeColor === colours.w || activeColor === colours.b) &&
    (enPassant === '-' || positions.includes(enPassant as ChessBoardAddress)) &&
    Number(halfMoves) >= 0 &&
    Number(fullMoves) >= 0;

  if (isValidFEN) {
    return {
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
                kingSide: castlingRights.includes(whitePieces.king),
                queenSide: castlingRights.includes(whitePieces.queen),
              },
              b: {
                kingSide: castlingRights.includes(blackPieces.king),
                queenSide: castlingRights.includes(blackPieces.queen),
              },
            },
      enPassant:
        (enPassant === '-' && false) ||
        (enPassant.length === 2 &&
          positions.includes(enPassant as ChessBoardAddress) && {
            x: files.indexOf(enPassant[0] as File),
            y: ranks.indexOf(enPassant[1] as Rank),
          }),
      halfMoves: Number(halfMoves),
      fullMoves: Number(fullMoves),
    };
  }
  throw new Error(errorCodes.invalid_fen);
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
          if (cell) row.push(cell);
          else if (typeof last === 'number') row[row.length - 1] = last + 1;
          else row.push(1);
          return row;
        }, [])
        .join('')
    )
    .join('/');

  return `${piecePlacement} ${activeColor} ${
    (castlingRights.w.kingSide ? whitePieces.king : '') +
      (castlingRights.w.queenSide ? whitePieces.queen : '') +
      (castlingRights.b.kingSide ? blackPieces.king : '') +
      (castlingRights.b.queenSide ? blackPieces.queen : '') || '-'
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
