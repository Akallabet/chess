import type { LoaderArgs } from '@remix-run/node';
import { ChessBoard } from '../components/chessboard';
import { useLoaderData } from '@remix-run/react';
import { FENForm } from '../components/fen';
import { useGame } from '../use-game';

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const FEN =
    url.searchParams.get('fen') ||
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  return FEN;
};

export default function App() {
  const FEN = useLoaderData<typeof loader>();
  const { board, getMoves, clearBoard, move } = useGame(FEN);
  return (
    <div>
      <div className="my-5" />
      <div className="mx-auto">
        {board && (
          <ChessBoard
            board={board}
            onSelect={getMoves}
            onEmptySquareClick={clearBoard}
            onMove={move}
          />
        )}
      </div>
      <div className="my-5" />
      <div className="mx-auto max-w-md">
        <FENForm FEN={FEN} />
      </div>
    </div>
  );
}
