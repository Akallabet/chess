import { flags, piecesByColor } from '../constants.js';
import { updateFENStateWithMove } from '../fen.js';
import { Coordinates, FENState, MoveBase, Piece, Square } from '../types.js';
import {
  areOpponents,
  getOpponentColor,
  isActiveColorPiece,
} from '../utils.js';
import { isCellUnderCheck } from './is-cell-under-check.js';
import { Pattern, patterns } from './patterns.js';

const isOutOfBound = (coord: Coordinates, board: Square[][]): boolean =>
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
  piece: Piece;
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
      if (targetCell) {
        if (
          areOpponents(targetCell, state.board[origin.y][origin.x] as Piece)
        ) {
          moves.push({
            piece,
            origin,
            target: target,
            ...(pattern.addFlags
              ? pattern.addFlags({ step, target, origin, state })
              : { [flags.capture]: true }),
          });
        }
        break;
      }
      moves.push({
        piece,
        origin,
        target: target,
        ...(pattern.addFlags
          ? pattern.addFlags({ step, target, origin, state })
          : {}),
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
  const piece = state.board[coord.y][coord.x];
  if (!piece) return [];

  return generateMovesFromPatterns({
    patterns: piecePatterns,
    state,
    origin: coord,
    piece,
  });
}

function getPieceCoord(
  piece: Piece,
  board: Square[][]
): Coordinates | undefined {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] === piece) return { y, x };
    }
  }
  return undefined;
}

function getOwnKingCoord(state: FENState): Coordinates | undefined {
  return getPieceCoord(piecesByColor[state.activeColor].king, state.board);
}
function getOpponentKingCoord(state: FENState): Coordinates | undefined {
  return getPieceCoord(
    piecesByColor[getOpponentColor(state.activeColor)].king,
    state.board
  );
}

export function calcIfKingUnderCheck(state: FENState): boolean {
  const kingCoord = getOwnKingCoord(state);
  if (!kingCoord) return false;
  return isCellUnderCheck(
    state,
    kingCoord,
    getOpponentColor(state.activeColor)
  );
}

export function isOpponentKingUnderCheck(state: FENState): boolean {
  const kingCoord = getOpponentKingCoord(state);
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
        square &&
        isActiveColorPiece(state.activeColor, square) // bad bad bad, please remove coercion :(
      ) {
        const pieceMoves = generateMoves({ y, x }, state, patterns[square])
          .map(move => {
            if (move.promotion) {
              return move.promotion.map(promotion => ({
                ...move,
                promotion: [promotion],
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
  const check = calcIfKingUnderCheck(moveState);
  if (!check) return {};

  if (!getOwnKingCoord(moveState)) return {};

  const checkmate = generateLegalMoves(moveState).length === 0;
  if (checkmate) return { checkmate };
  return { check: true };
}

export function generateLegalMovesForActiveSide(
  state: FENState
): Array<MoveBase> {
  return generateLegalMoves(state).map(move => {
    return {
      ...move,
      ...calcCheckFlags(move, state),
    };
  });
}
