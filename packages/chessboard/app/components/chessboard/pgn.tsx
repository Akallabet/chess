import type { ChessState } from '@chess/chess';

export function Pgn({ moves = [] }: ChessState) {
  return (
    <div className="flex w-80 flex-col">
      {moves.map((movePair, i: number) => {
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
