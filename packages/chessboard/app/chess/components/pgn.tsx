import type { ChessState, Move } from '@chess/chess';
import { useChess } from '../hooks/use-chess';

interface PGNMove extends Move {
  index: number;
}
export function Pgn({ moves = [] }: ChessState) {
  return (
    <div className="flex w-80 flex-col overflow-hidden">
      {moves
        .reduce((acc, move, index) => {
          const lastMove = acc[acc.length - 1];
          if (Array.isArray(lastMove) && lastMove.length === 1) {
            acc[acc.length - 1].push({ ...move, index });
          } else {
            acc.push([{ ...move, index }]);
          }
          return acc;
        }, [] as PGNMove[][])
        .map((movePair, i) => {
          return (
            <p key={i}>
              <span className="mr-1">{`${i + 1}.`}</span>
              <span className="mr-1">{movePair[0].san}</span>
              {movePair[1] && <span className="mr-1">{movePair[1].san}</span>}
            </p>
          );
        })}
    </div>
  );
}
