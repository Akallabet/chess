import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ChessBoard } from '~/chess/components';
import { Provider as ChessProvider } from '~/chess/components/provider';
import { useGame } from '~/chess/hooks/use-game';

export const loader = ({ params }: LoaderArgs) => {
  const { gameId } = params;
  return json(gameId);
};

export default function Game() {
  const gameId = useLoaderData<typeof loader>();
  const game = useGame(gameId);

  return game ? (
    <div>
      <div className="my-5" />
      <ChessProvider gameId={gameId}>
        <ChessBoard />
      </ChessProvider>
    </div>
  ) : (
    'Loading'
  );
}
