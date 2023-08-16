import type { ChessState, Move } from '@chess/chess';

export function Pgn({ moves = [] }: ChessState) {
  return (
    <div className="flex w-80 flex-col overflow-hidden">
      {moves
        .reduce((acc, move) => {
          const lastMove = acc[acc.length - 1];
          if (Array.isArray(lastMove) && lastMove.length === 1) {
            acc[acc.length - 1].push(move);
          } else {
            acc.push([move]);
          }
          return acc;
        }, [] as Move[][])
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
