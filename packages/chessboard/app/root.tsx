import { Links, LiveReload } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css';
import { useState } from 'react';
import { start } from '@chess/chess';
import { ChessBoard } from './components/chessboard';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

const useGame = (FEN: string) => {
  const [game] = useState(start(FEN));
  return game;
};

export default function App() {
  const { board } = useGame(
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
  );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Chessboard</title>
        <Links />
      </head>
      <body>
        <div className="">{board && <ChessBoard board={board} />}</div>
        <LiveReload />
      </body>
    </html>
  );
}
