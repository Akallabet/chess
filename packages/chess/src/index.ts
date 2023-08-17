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
} from './types.js';

import {
  generateLegalMovesForActiveSide,
  calcIfKingUnderCheck,
} from './moves/index.js';
import { translateMoveToSAN, translateSANToMove } from './san.js';
import { buildPGNString } from './pgn.js';

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

function deriveState(
  FENState: FENState,
  state: ChessInitialState,
  currentMove: number
): ChessState {
  const moves = generateLegalMovesForActiveSide(FENState);

  const isKingUnderCheck = calcIfKingUnderCheck(FENState);
  const isStalemate = moves.length === 0 && !isKingUnderCheck;
  const isDraw =
    state.mode === 'standard' && (FENState.halfMoves === 50 || isStalemate);
  const isCheckmate = isKingUnderCheck && moves.length === 0;
  const isGameOver = isDraw || isCheckmate;

  const result =
    (isDraw && '1/2-1/2') ||
    (isCheckmate && ((FENState.activeColor === 'w' && '0-1') || '1-0')) ||
    '*';

  const newState = {
    ...FENState,
    mode: state.mode || modes.standard,
    files,
    ranks,
    movesBoard: createMovesBoard(FENState.board, moves),
    FEN: toFEN(FENState),
    PGN: buildPGNString({ ...state, result }),
    result,
    event: state.event,
    date: state.date,
    site: state.site,
    white: state.white,
    black: state.black,
    moves: state.moves || [],
    currentMove,
    isGameOver,
    isCheckmate,
    isCheck: isKingUnderCheck && !isCheckmate,
    isDraw,
    isStalemate,
  };
  return newState;
}

export function start(initialState: ChessInitialState): ChessState {
  return deriveState(
    fromFEN(initialState.FEN),
    initialState,
    initialState.currentMove || 0
  );
}

export function move(san: string, inputState: ChessInitialState): ChessState {
  const state = deriveState(
    fromFEN(inputState.FEN),
    inputState,
    inputState.currentMove || 0
  );
  if (!state.moves) state.moves = [];
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
    state.moves.push({ ...move, FEN: toFEN(FENStateWithMove) });
    return deriveState(FENStateWithMove, state, state.moves.length - 1);
  } catch (e) {
    return state;
  }
}

export function goToMove(
  index: number,
  inputState: ChessInitialState
): ChessState {
  const state = deriveState(
    fromFEN(inputState.FEN),
    inputState,
    inputState.currentMove || 0
  );
  if (!state.moves || !state.moves[index]) return state;
  const move = state.moves[index];
  return deriveState(fromFEN(move.FEN), inputState, index);
}

export function moveBack(inputState: ChessInitialState): ChessState {
  const currentMove = inputState.currentMove || 0;
  if (!inputState.moves || !inputState.moves.length)
    return deriveState(fromFEN(inputState.FEN), inputState, currentMove);
  return goToMove(currentMove - 1, inputState);
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
