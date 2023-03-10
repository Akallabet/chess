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
  const { board, action, positions, files, ranks } = useGame(FEN, 'demo');
  return (
    <div>
      <div className="my-5" />
      <div className="mx-auto">
        {board && (
          <ChessBoard
            board={board}
            positions={positions}
            onCellClick={action}
            files={files}
            ranks={ranks}
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
