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

function deriveState(FENState: FENState, state: ChessInitialState): ChessState {
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

  return {
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
    isGameOver,
    isCheckmate,
    isCheck: isKingUnderCheck && !isCheckmate,
    isDraw,
    isStalemate,
  };
}

export function start(initialState: ChessInitialState): ChessState {
  return deriveState(fromFEN(initialState.FEN), initialState);
}

export function move(san: string, inputState: ChessInitialState): ChessState {
  const state = deriveState(fromFEN(inputState.FEN), inputState);
  try {
    const FENStateWithMove = updateFENStateWithMove(
      translateSANToMove(san, state.movesBoard),
      state.board,
      state.activeColor,
      state.castlingRights,
      state.halfMoves,
      state.fullMoves
    );
    return deriveState(FENStateWithMove, inputState);
  } catch (e) {
    return state;
  }
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

export { files, ranks, modes } from './constants.js';

export * from './types.js';
