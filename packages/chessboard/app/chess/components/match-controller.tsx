import type { ChessState } from '@chess/chess';
import { useChess } from '../hooks/use-chess';
import { Pgn } from './pgn';

export function MatchController(props: ChessState) {
  const { moveBack, moveForward, moveToStart, moveToEnd, resign } = useChess();
  const errorMove = props.moves.find(move => move.error);

  return (
    <div className="h-full">
      <div className="text-center text-2xl font-bold">Moves</div>
      {!errorMove && props.isGameOver ? (
        <div>
          <p>
            <span>{props.isDraw && 'Draw'}</span>
            <span>{props.isCheckmate && 'Checkmate -'}</span>
            <span>
              {(props.isWhiteWin && 'White wins') ||
                (props.isBlackWin && 'Black wins')}
            </span>
          </p>
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
      <div className="flex w-full flex-row">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black rounded px-4 py-2 font-bold"
          onClick={resign}
        >
          Resign
        </button>
      </div>
    </div>
  );
}
