import { Links, LiveReload } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css';
import { ReactElement, useEffect, useState } from 'react';
import { start } from '@chess/chess';
interface Square {
  name: string;
}
interface SquareProps {
  children: string;
}

const isEven = (n: number) => n % 2 === 0;
const isOdd = (n: number) => !isEven(n);

const BlackSquare = ({ children }: SquareProps) => (
  <div className="bg-secondary h-full w-1/8 ">{children}</div>
);
const WhiteSquare = ({ children }: SquareProps) => (
  <div className="bg-primary h-full w-1/8">{children}</div>
);
const ChessBoard = ({ board }: { board: Square[][] }) => (
  <div className="border-2 border-black flex flex-col w-full h-full-w sm:w-452 sm:h-452">
    {board.map((row, i) => (
      <div key={i} className="flex flex-row w-full h-1/8">
        {row.map(({ name }, j) => {
          const isWhite = (isEven(i) && isEven(j)) || (isOdd(i) && isOdd(j));

          return isWhite ? (
            <WhiteSquare key={i}>{name}</WhiteSquare>
          ) : (
            <BlackSquare key={i}>{name}</BlackSquare>
          );
        })}
      </div>
    ))}
  </div>
);

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }];

const useGame = () => {
  const startGame = () => setGame(start('8/8/8/8/8/8/8/8 w KQkq - 0 1'));
  const [game, setGame] = useState(start('8/8/8/8/8/8/8/8 w KQkq - 0 1'));
  return game;
};
export default function App() {
  const { board } = useGame();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Remix: So great, it's funny!</title>
        <Links />
      </head>
      <body>
        <div className="">{board && <ChessBoard board={board} />}</div>
        <LiveReload />
      </body>
    </html>
  );
}
