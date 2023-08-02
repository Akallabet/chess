import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ChessBoard } from '~/components/chessboard';
import { useGame } from '~/shared/hooks/use-game';

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
      {game && (
        <ChessBoard
          {...game}
          onCellClick={game.action}
          onPromotion={game.promote}
        />
      )}
    </div>
  ) : (
    'Loading'
  );
}
