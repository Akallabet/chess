import type { LoaderArgs } from '@remix-run/node';
import { useState } from 'react';
import { start } from '@chess/chess';
import { ChessBoard } from '../components/chessboard';
import { useLoaderData } from '@remix-run/react';
import { FENForm } from '~/components/fen';

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const FEN =
    url.searchParams.get('fen') ||
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  return FEN;
};

const useGame = (FEN: string) => {
  const [game] = useState(start(FEN));
  return game;
};

export default function App() {
  const FEN = useLoaderData<typeof loader>();
  const { board } = useGame(FEN);
  return (
    <div>
      <div className="my-5" />
      <div className="mx-auto">{board && <ChessBoard board={board} />}</div>
      <div className="my-5" />
      <div className="mx-auto max-w-md">
        <FENForm />
      </div>
    </div>
  );
}
