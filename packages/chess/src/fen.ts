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
  ChessColor,
  MoveBase,
  CastlingRights,
} from './types.js';
import {
  isKing,
  isPawn,
  isRook,
  isWhitePiece,
  getPieceCoord,
} from './utils.js';

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

export function getBoardStateFromFEN(FEN: string): string {
  const parts = FEN.split(' ');

  return `${parts[0]} ${parts[2]} ${parts[3]}`;
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
    const board = boardFromFEN(piecePlacement);
    return {
      board,
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
      kings: {
        w: getPieceCoord(whitePieces.king, board),
        b: getPieceCoord(blackPieces.king, board),
      },
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

const changeActiveColor = (activeColor: ChessColor): ChessColor =>
  activeColor === colours.w ? colours.b : colours.w;

export function updateBoardWithMove(move: MoveBase, board: Square[][]) {
  const boardWithMove = board.map(row => row.map(cell => cell));

  if (move.enPassant) {
    boardWithMove[move.enPassant.y][move.enPassant.x] = emptySquare;
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
  } else if (move.promotion) {
    boardWithMove[move.target.y][move.target.x] = move.promotion[0];
  } else if (move.kingSideCastling) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
    boardWithMove[move.target.y][5] = boardWithMove[move.target.y][7];
    boardWithMove[move.target.y][7] = emptySquare;
  } else if (move.queenSideCastling) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
    boardWithMove[move.target.y][3] = boardWithMove[move.target.y][0];
    boardWithMove[move.target.y][0] = emptySquare;
  } else if (move.capture) {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
  } else {
    boardWithMove[move.target.y][move.target.x] =
      boardWithMove[move.origin.y][move.origin.x];
  }

  boardWithMove[move.origin.y][move.origin.x] = emptySquare;
  return boardWithMove;
}

function updateEnPassant(move: MoveBase) {
  const enPassantRank = isWhitePiece(move.piece)
    ? move.target.y + 1
    : move.target.y - 1;
  return (
    isPawn(move.piece) &&
    Math.abs(move.target.y - move.origin.y) === 2 && {
      y: enPassantRank,
      x: move.target.x,
    }
  );
}

function updateCastlingRights(
  move: MoveBase,
  board: Square[][],
  activeColor: string,
  castlingRights: CastlingRights
) {
  const isCastlingMove = move.kingSideCastling || move.queenSideCastling;
  return {
    w: {
      kingSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === board[0].length - 1)) &&
        activeColor === colours.w
          ? false
          : castlingRights.w.kingSide,
      queenSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === 0)) &&
        activeColor === colours.w
          ? false
          : castlingRights.w.queenSide,
    },
    b: {
      kingSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === board[0].length - 1)) &&
        activeColor === colours.b
          ? false
          : castlingRights.b.kingSide,
      queenSide:
        (isCastlingMove ||
          isKing(move.piece) ||
          (isRook(move.piece) && move.origin.x === 0)) &&
        activeColor === colours.b
          ? false
          : castlingRights.b.queenSide,
    },
  };
}

export function updateFENStateWithMove(
  move: MoveBase,
  board: Square[][],
  activeColor: ChessColor,
  castlingRights: CastlingRights,
  halfMoves: number,
  fullMoves: number
): FENState {
  const boardWithMove = updateBoardWithMove(move, board);
  return {
    castlingRights: updateCastlingRights(
      move,
      board,
      activeColor,
      castlingRights
    ),
    board: boardWithMove,
    activeColor: changeActiveColor(activeColor),
    halfMoves: isPawn(move.piece) || move.capture ? 0 : halfMoves + 1,
    fullMoves: activeColor === colours.b ? fullMoves + 1 : fullMoves,
    enPassant: updateEnPassant(move),
    kings: {
      w: getPieceCoord(whitePieces.king, boardWithMove),
      b: getPieceCoord(blackPieces.king, boardWithMove),
    },
  };
}
