import { modes, files, ranks, piecesMap } from './constants.js';
import { fromFEN, toFEN, updateFENStateWithMove } from './fen.js';
import {
  ChessInitialState,
  ChessState,
  Coordinates,
  FENState,
  Move,
  Square,
  MoveBase,
  ChessStartStatePGN,
  ChessStartStateFEN,
  Piece,
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  calcIfKingUnderCheck,
} from './moves/index.js';
import { translateMoveToSAN, translateSANToMove } from './san.js';
import { buildPGNString, fromPGNString } from './pgn.js';
import { getPieceCoord, isBlackPiece, isWhitePiece } from './utils.js';

export function createMovesBoard(
  board: Square[][],
  moves: Array<MoveBase>
): Array<Array<Array<Move>>> {
  const movesBoard: Array<Array<Array<Move>>> = board.map(row => {
    return row.map(() => []);
  });

  for (let i = 0; i < moves.length; i++) {
    const { x, y } = moves[i].target;
    movesBoard[y][x].push({ ...moves[i], san: [''] });
  }

  for (let i = 0; i < movesBoard.length; i++) {
    for (let j = 0; j < movesBoard[i].length; j++) {
      const moveSquare = movesBoard[i][j];
      for (let x = 0; x < moveSquare.length; x++) {
        moveSquare[x].san = translateMoveToSAN(moveSquare, x);
      }
    }
  }

  return movesBoard;
}
function calcInsufficientMaterial(board: Square[][]): boolean {
  const pieces: Piece[] = board
    .flat()
    .filter(square => square !== '')
    .map(piece => piece as Piece); //Why TypeScript can't infer that piece is Piece?

  const whitePieces = pieces.filter(isWhitePiece);
  const blackPieces = pieces.filter(isBlackPiece);
  if (whitePieces.length === 1 && blackPieces.length === 1) return true;
  if (whitePieces.length === 1 && blackPieces.length === 2) {
    return Boolean(
      blackPieces.find(piece => piece === piecesMap.b || piece === piecesMap.n)
    );
  }
  if (blackPieces.length === 1 && whitePieces.length === 2) {
    return Boolean(
      whitePieces.find(piece => piece === piecesMap.B || piece === piecesMap.N)
    );
  }
  if (whitePieces.length === 2 && blackPieces.length === 2) {
    // Two bishops on the same color
    // https://en.wikipedia.org/wiki/Chess_endgame#Two_bishops
    // https://www.chessprogramming.org/Two_Bishops_Endgame
    const whiteBishopCoord = getPieceCoord(piecesMap.B, board);
    const blackBishopCoord = getPieceCoord(piecesMap.b, board);
    if (!whiteBishopCoord || !blackBishopCoord) return false;
    // calculate if white bishop and black bishop are on the same color
    return (
      (whiteBishopCoord.x + whiteBishopCoord.y) % 2 === 0 &&
      (blackBishopCoord.x + blackBishopCoord.y) % 2 === 0
    );
  }
  return false;
}

function deriveState(FENState: FENState, state: ChessInitialState): ChessState {
  const moves = generateLegalMovesForActiveSide(FENState);

  const isInsufficientMaterial = calcInsufficientMaterial(FENState.board);
  const isKingUnderCheck = calcIfKingUnderCheck(FENState);

  const isStalemate = moves.length === 0 && !isKingUnderCheck;
  const isDraw =
    state.result === '1/2-1/2' ||
    (state.mode === 'standard' &&
      (FENState.halfMoves === 50 || isStalemate || isInsufficientMaterial));
  const isCheckmate = isKingUnderCheck && moves.length === 0;
  const isWhiteWin =
    state.result === '1-0' || (isCheckmate && FENState.activeColor === 'w');
  const isBlackWin =
    state.result === '0-1' || (isCheckmate && FENState.activeColor === 'b');
  const isGameOver = isDraw || isBlackWin || isWhiteWin || isCheckmate;

  const result =
    (isDraw && '1/2-1/2') ||
    (isBlackWin && '0-1') ||
    (isWhiteWin && '1-0') ||
    '*';

  const newState = {
    ...FENState,
    mode: state.mode || modes.standard,
    files,
    ranks,
    movesBoard: createMovesBoard(FENState.board, moves),
    FEN: toFEN(FENState),
    PGN: buildPGNString({ ...state, result }),
    initialFEN: state.initialFEN,
    result,
    event: state.event,
    date: state.date,
    site: state.site,
    round: state.round,
    white: state.white,
    black: state.black,
    moves: state.moves,
    currentMove: state.currentMove,
    error: state.error,
    isWhiteWin,
    isBlackWin,
    isGameOver,
    isCheckmate,
    isCheck: isKingUnderCheck && !isCheckmate,
    isInsufficientMaterial,
    isDraw,
    isStalemate,
  };
  return newState;
}

export function startFromPGN(state: ChessStartStatePGN): ChessState {
  return fromPGNString(state.PGN);
}

export function start(state: ChessStartStateFEN): ChessState {
  return deriveState(fromFEN(state.initialFEN || state.FEN), {
    ...state,
    initialFEN: state.initialFEN || state.FEN,
    moves: state.moves || [],
    currentMove: state.currentMove || -1,
  });
}
export function moveInternal(
  san: string,
  inputState: ChessInitialState
): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  if (inputState.currentMove !== inputState.moves.length - 1) {
    return state;
  }
  try {
    const move = translateSANToMove(san, state.movesBoard);
    const FENStateWithMove = updateFENStateWithMove(
      move,
      state.board,
      state.activeColor,
      state.castlingRights,
      state.halfMoves,
      state.fullMoves
    );
    state.moves = [...state.moves, { ...move, FEN: toFEN(FENStateWithMove) }];
    state.currentMove = state.moves.length - 1;
    return deriveState(FENStateWithMove, state);
  } catch (e: unknown) {
    if (e instanceof Error) {
      state.moves = [
        ...state.moves,
        { san: [san], FEN: toFEN(state), error: e.message },
      ];
      state.error = e.message;
      return state;
    }
    return state;
  }
}

export function move(san: string, inputState: ChessInitialState): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  if (state.isGameOver) return state;
  return moveInternal(san, state);
}

export function draw(inputState: ChessInitialState): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  if (state.isGameOver) return state;
  return deriveState(fromFEN(inputState.FEN), { ...state, result: '1/2-1/2' });
}

export function resign(inputState: ChessInitialState): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  if (state.isGameOver) return state;
  return deriveState(fromFEN(inputState.FEN), {
    ...state,
    result: state.activeColor === 'w' ? '0-1' : '1-0',
  });
}

export function goToMove(
  index: number,
  inputState: ChessInitialState
): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  if (!state.moves[index]) return state;
  state.currentMove = index;
  const move = state.moves[state.currentMove];
  return deriveState(fromFEN(move.FEN), state);
}

export function moveBack(inputState: ChessInitialState): ChessState {
  if (!inputState.moves[inputState.currentMove - 1])
    return deriveState(fromFEN(inputState.initialFEN), {
      ...inputState,
      currentMove: -1,
    });
  return goToMove(inputState.currentMove - 1, inputState);
}

export function moveForward(inputState: ChessInitialState): ChessState {
  if (!inputState.moves[inputState.currentMove + 1])
    return deriveState(fromFEN(inputState.FEN), inputState);
  return goToMove(inputState.currentMove + 1, inputState);
}

export function moveToStart(inputState: ChessInitialState): ChessState {
  return deriveState(fromFEN(inputState.initialFEN), {
    ...inputState,
    currentMove: -1,
  });
}

export function moveToEnd(inputState: ChessInitialState): ChessState {
  return goToMove(inputState.moves.length - 1, inputState);
}

export function moves(coord: Coordinates, state: ChessState): Array<Move> {
  const moves = [];
  for (const row of state.movesBoard) {
    for (const cell of row) {
      for (const move of cell) {
        if (move.origin.x === coord.x && move.origin.y === coord.y) {
          moves.push(move);
        }
      }
    }
  }
  return moves;
}

export * from './types.js';
