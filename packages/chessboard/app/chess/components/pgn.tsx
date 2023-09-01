import type { PGNMove as PGNMoveBase } from '@chess/chess';
import { useChess } from '../hooks/use-chess';

interface PGNMove extends PGNMoveBase {
  index: number;
  selected: boolean;
}
export function Pgn() {
  const {
    game: { moves, currentMove, result },
  } = useChess();

  const errorMove = moves.find(move => move.error);

  return (
    <div className="flex w-80 flex-col overflow-hidden">
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
            <p key={i}>
              <span className="mr-1">{`${i + 1}.`}</span>
              <span
                className={`mr-1 ${movePair[0].selected ? 'font-bold' : ''}`}
              >
                {movePair[0].san}
              </span>
              {movePair[1] && (
                <span
                  className={`mr-1 ${movePair[1].selected ? 'font-bold' : ''}`}
                >
                  {movePair[1].san}
                </span>
              )}
              {i === pgnMoves.length - 1 && result && !errorMove && (
                <span className="mr-1">{result}</span>
              )}
              {i === pgnMoves.length - 1 && errorMove && (
                <span className="mr-1">{errorMove.error}</span>
              )}
            </p>
          );
        })}
    </div>
  );
}
