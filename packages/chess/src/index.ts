import { modes, files, ranks } from './constants.js';
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
} from './types.js';

import {
  generateLegalMoves,
  calcIfKingUnderCheck,
  generateDemoMoves,
} from './moves-generation.js';
import { translateMoveToSAN, translateSANToMove } from './san.js';
import { buildPGNString, fromPGNString } from './pgn.js';
import {
  calcInsufficientMaterial,
  calcThreefoldRepetition,
} from './end-game.js';

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

const generateMovesMap = {
  [modes.standard]: generateLegalMoves,
  [modes.demo]: generateDemoMoves,
};

function deriveState(state: FENState & ChessInitialState): ChessState {
  const legalMoves = generateMovesMap[state.mode](state);

  const isInsufficientMaterial = calcInsufficientMaterial(state.board);
  const isThreefoldRepetition = calcThreefoldRepetition(state);
  const isKingUnderCheck = calcIfKingUnderCheck(state);

  const isStalemate = legalMoves.length === 0 && !isKingUnderCheck;
  const isDraw =
    state.result === '1/2-1/2' ||
    (state.mode === 'standard' &&
      (state.halfMoves === 50 ||
        isStalemate ||
        isInsufficientMaterial ||
        isThreefoldRepetition));
  const isCheckmate = isKingUnderCheck && legalMoves.length === 0;
  const isWhiteWin =
    state.result === '1-0' || (isCheckmate && state.activeColor === 'w');
  const isBlackWin =
    state.result === '0-1' || (isCheckmate && state.activeColor === 'b');
  const isGameOver = isDraw || isBlackWin || isWhiteWin || isCheckmate;

  const result =
    (isDraw && '1/2-1/2') ||
    (isBlackWin && '0-1') ||
    (isWhiteWin && '1-0') ||
    '*';

  const newState = {
    ...state,
    mode: state.mode || modes.standard,
    files,
    ranks,
    movesBoard: createMovesBoard(state.board, legalMoves),
    PGN: buildPGNString({ ...state, result }),
    initialFEN: state.initialFEN,
    FEN: toFEN(state),
    result,
    event: state.event,
    date: state.date,
    site: state.site,
    round: state.round,
    white: state.white,
    black: state.black,
    history: state.history,
    currentMove: state.currentMove,
    error: state.error,
    isWhiteWin,
    isBlackWin,
    isGameOver,
    isCheckmate,
    isCheck: isKingUnderCheck && !isCheckmate,
    isInsufficientMaterial,
    isThreefoldRepetition,
    isDraw,
    isStalemate,
  };
  return newState;
}

export function startFromPGN(state: ChessStartStatePGN): ChessState {
  return fromPGNString(state.PGN);
}

export function start(state: ChessStartStateFEN): ChessState {
  return deriveState({
    ...state,
    initialFEN: state.FEN,
    history: state.history || [],
    currentMove: state.currentMove || -1,
    ...fromFEN(state.FEN),
  });
}

export interface ChessMoveInternalState {
  san: string;
  state: ChessState;
}

export function moveInternal({
  san,
  state,
}: ChessMoveInternalState): ChessState {
  const move = translateSANToMove(san, state.movesBoard);
  const FENStateWithMove = updateFENStateWithMove(
    move,
    state.board,
    state.activeColor,
    state.castlingRights,
    state.halfMoves,
    state.fullMoves,
    state.opponentColor
  );
  return deriveState({
    ...state,
    history: [...state.history, { ...move, FEN: toFEN(FENStateWithMove) }],
    currentMove: state.currentMove + 1,
    ...FENStateWithMove,
  });
}

export interface ChessMoveInputState {
  san: string;
  state: ChessInitialState;
}

export function move({
  san,
  state: inputState,
}: ChessMoveInputState): ChessState {
  const state = deriveState({ ...inputState, ...fromFEN(inputState.FEN) });
  if (inputState.currentMove !== inputState.history.length - 1) {
    return state;
  }
  if (state.isGameOver) return state;
  return moveInternal({ san, state });
}

export function draw(inputState: ChessInitialState): ChessState {
  const state = deriveState({ ...inputState, ...fromFEN(inputState.FEN) });
  if (state.isGameOver) return state;
  return deriveState({
    ...state,
    result: '1/2-1/2',
    ...fromFEN(inputState.FEN),
  });
}

export function resign(inputState: ChessInitialState): ChessState {
  const state = deriveState({ ...inputState, ...fromFEN(inputState.FEN) });
  if (state.isGameOver) return state;
  return deriveState({
    ...state,
    result: state.activeColor === 'w' ? '0-1' : '1-0',
    ...fromFEN(inputState.FEN),
  });
}

export function goToMove({
  move,
  state: inputState,
}: {
  move: number;
  state: ChessInitialState;
}): ChessState {
  const state = deriveState({ ...inputState, ...fromFEN(inputState.FEN) });
  if (!state.history[move]) return state;
  return deriveState({
    ...state,
    currentMove: move,
    ...fromFEN(state.history[move].FEN),
  });
}

export function moveBack(state: ChessInitialState): ChessState {
  if (!state.history[state.currentMove - 1])
    return deriveState({
      ...state,
      currentMove: -1,
      ...fromFEN(state.initialFEN),
    });
  return goToMove({ move: state.currentMove - 1, state });
}

export function moveForward(state: ChessInitialState): ChessState {
  if (!state.history[state.currentMove + 1])
    return deriveState({ ...state, ...fromFEN(state.FEN) });
  return goToMove({ move: state.currentMove + 1, state });
}

export function moveToStart(inputState: ChessInitialState): ChessState {
  return deriveState({
    ...inputState,
    currentMove: -1,
    ...fromFEN(inputState.initialFEN),
  });
}

export function moveToEnd(state: ChessInitialState): ChessState {
  return goToMove({ move: state.history.length - 1, state });
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
