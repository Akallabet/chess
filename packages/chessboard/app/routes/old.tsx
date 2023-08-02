import type { LoaderArgs } from '@remix-run/node';
import { ChessBoard } from '../components/chessboard';
import { useLoaderData } from '@remix-run/react';
import { useGame } from '~/shared/hooks/use-game';

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const FEN =
    url.searchParams.get('fen') ||
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  return FEN;
};

export default function App() {
  const FEN = useLoaderData<typeof loader>();
  const game = useGame(FEN, 'standard');

  return (
    <div>
      <div className="my-5" />
      {game && (
        <ChessBoard
          {...game}
          onCellClick={game.action}
          onPromotion={game.promote}
        />
      )}
    </div>
  );
}
