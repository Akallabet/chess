import type { PGNMove as PGNMoveBase } from '@chess/chess';
import { useChess } from '../hooks/use-chess';

interface PGNMove extends PGNMoveBase {
  index: number;
  selected: boolean;
}
export function Pgn() {
  const {
    game: { moves, currentMove, result },
    goToMove,
  } = useChess();

  const errorMove = moves.find(move => move.error);

  return (
    <div className="max-w-100 flex flex-col overflow-hidden">
      {moves
        .reduce((acc, move, index) => {
          const lastMove = acc[acc.length - 1];
          const pgnMove = { ...move, index, selected: index === currentMove };
          if (Array.isArray(lastMove) && lastMove.length === 1) {
            acc[acc.length - 1].push(pgnMove);
          } else {
            acc.push([pgnMove]);
          }
          return acc;
        }, [] as PGNMove[][])
        .map((movePair, i, pgnMoves) => {
          return (
            <div key={i} className="flex justify-between">
              <div>{`${i + 1}.`}</div>
              <button
                onClick={() => goToMove(movePair[0].index)}
                className={` ${movePair[0].selected ? 'font-bold' : ''}`}
              >
                {movePair[0].san}
              </button>
              {movePair[1] && (
                <button
                  onClick={() => goToMove(movePair[1].index)}
                  className={` ${movePair[1].selected ? 'font-bold' : ''}`}
                >
                  {movePair[1].san}
                </button>
              )}
              {i === pgnMoves.length - 1 && result && !errorMove && (
                <div>{result}</div>
              )}
              {i === pgnMoves.length - 1 && errorMove && (
                <div>{errorMove.error}</div>
              )}
            </div>
          );
        })}
    </div>
  );
}
