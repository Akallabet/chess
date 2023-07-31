import { flags } from '../constants.js';
import { ChessBoardType, Coordinates, FENState, MoveBase } from '../types.js';
import {
  areOpponents,
  getKingPiece,
  getOpponentColor,
  getPieceCoord,
  isActiveColorPiece,
} from '../utils.js';
import { isCellUnderCheck } from './is-cell-under-check.js';
import { updateFENStateWithMove } from './move-and-update-state.js';
import { Pattern, patterns } from './patterns.js';

const isOutOfBound = (coord: Coordinates, board: ChessBoardType): boolean =>
  coord.y >= board.length ||
  coord.x >= board[0].length ||
  coord.y < 0 ||
  coord.x < 0;

const generateMovesFromPatterns = ({
  patterns,
  origin,
  state,
  piece,
}: {
  patterns: Array<Pattern>;
  origin: Coordinates;
  state: FENState;
  piece: string;
}): Array<MoveBase> => {
  const moves: Array<MoveBase> = [];
  for (const pattern of patterns) {
    const proceed = true;
    let step = 0;
    let lastMove = { target: origin };
    while (proceed) {
      const target = pattern.advance(lastMove.target);
      const outOfBound = isOutOfBound(target, state.board);
      if (outOfBound) break;
      const willStop = pattern.shallStop({
        step,
        target,
        origin,
        state,
      });
      if (willStop) break;

      const targetCell = state.board[target.y][target.x];
      if (targetCell.piece) {
        if (
          areOpponents(
            targetCell.piece,
            state.board[origin.y][origin.x].piece as string
          )
        ) {
          moves.push({
            piece,
            origin,
            target: target,
            flags: {
              ...(pattern.addFlags
                ? pattern.addFlags({ step, target, origin, state })
                : { [flags.capture]: true }),
            },
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: target,
        flags: {
          ...(pattern.addFlags
            ? pattern.addFlags({ step, target, origin, state })
            : { [flags.move]: true }),
        },
      });
      step++;
      lastMove = moves[moves.length - 1];
    }
  }
  return moves;
};

export function generateMoves(
  coord: Coordinates,
  state: FENState,
  piecePatterns: Array<Pattern>
): Array<MoveBase> {
  const { piece } = state.board[coord.y][coord.x];
  if (!piece) return [];

  return generateMovesFromPatterns({
    patterns: piecePatterns,
    state,
    origin: coord,
    piece,
  });
}

export function isKingUnderCheck(state: FENState): boolean {
  const kingCoord = getPieceCoord(getKingPiece(state.activeColor), state.board);
  if (!kingCoord) return false;
  return isCellUnderCheck(
    state,
    kingCoord,
    getOpponentColor(state.activeColor)
  );
}

export function isOpponentKingUnderCheck(state: FENState): boolean {
  const kingCoord = getPieceCoord(
    getKingPiece(getOpponentColor(state.activeColor)),
    state.board
  );
  if (!kingCoord) return false;
  return isCellUnderCheck(state, kingCoord);
}

function isMoveValid(move: MoveBase, state: FENState): boolean {
  return !isOpponentKingUnderCheck(
    updateFENStateWithMove(
      move,
      state.board,
      state.activeColor,
      state.castlingRights,
      state.halfMoves,
      state.fullMoves
    )
  );
}

function generateLegalMoves(state: FENState): Array<MoveBase> {
  const moves: Array<MoveBase> = [];
  for (let y = 0; y < state.board.length; y++) {
    const row = state.board[y];
    for (let x = 0; x < row.length; x++) {
      const square = row[x];
      if (
        square.piece &&
        isActiveColorPiece(state.activeColor, square.piece as string) // bad bad bad, please remove coercion :(
      ) {
        const pieceMoves = generateMoves(
          { y, x },
          state,
          patterns[square.piece as string]
        )
          .map(move => {
            if (move.flags.promotion) {
              return move.flags.promotion.split('').map(promotion => ({
                ...move,
                flags: { ...move.flags, promotion },
              }));
            }
            return move;
          })
          .flat();
        moves.push(...pieceMoves.filter(move => isMoveValid(move, state)));
      }
    }
  }
  return moves;
}

function calcCheckFlags(
  move: MoveBase,
  state: FENState
): { check?: boolean; checkmate?: boolean } {
  const moveState = updateFENStateWithMove(
    move,
    state.board,
    state.activeColor,
    state.castlingRights,
    state.halfMoves,
    state.fullMoves
  );
  const check = isKingUnderCheck(moveState);
  if (!check) return {};

  const kingCoord = getPieceCoord(
    getKingPiece(moveState.activeColor),
    moveState.board
  );
  if (!kingCoord) return {};

  const checkmate = generateLegalMoves(moveState).length === 0;
  if (checkmate) return { checkmate };
  return { check: true };
}

export function generateLegalMovesForActiveSide(
  state: FENState
): Array<MoveBase> {
  return generateLegalMoves(state).map(move => ({
    ...move,
    flags: {
      ...move.flags,
      ...calcCheckFlags(move, state),
    },
  }));
}
