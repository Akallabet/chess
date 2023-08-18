import type { Move } from '@chess/chess';
import { useChess } from '../hooks/use-chess';

interface PGNMove extends Move {
  index: number;
  selected: boolean;
}
export function Pgn() {
  const {
    game: { moves, currentMove },
  } = useChess();
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
        .map((movePair, i) => {
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
            </p>
          );
        })}
    </div>
  );
}
