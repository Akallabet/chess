import type { ChessState } from '@chess/chess';
import { useChess } from '../hooks/use-chess';
import { Pgn } from './pgn';

export function MatchController(props: ChessState) {
  const { moveBack, moveForward, moveToStart, moveToEnd } = useChess();
  return (
    <div className="h-full">
      <div className="text-center text-2xl font-bold">Moves</div>
      {props.isGameOver ? (
        <div>
          <p>{props.isCheckmate && 'Checkmate'}</p>
        </div>
      ) : null}
      <div>
        <Pgn />
      </div>
      <div className="flex w-full flex-row">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black rounded px-4 py-2 font-bold"
          onClick={moveToStart}
        >
          {'<<'}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black rounded px-4 py-2 font-bold"
          onClick={moveBack}
        >
          {'<'}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black rounded px-4 py-2 font-bold"
          onClick={moveForward}
        >
          {'>'}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black rounded px-4 py-2 font-bold"
          onClick={moveToEnd}
        >
          {'>>'}
        </button>
      </div>
    </div>
  );
}
