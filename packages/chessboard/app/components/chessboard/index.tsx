import type { ReactElement } from 'react';
interface Square {
  piece: string;
}
interface SquareProps {
  children: string;
}

const isEven = (n: number) => n % 2 === 0;
const isOdd = (n: number) => !isEven(n);

const BlackSquare = ({ children }: SquareProps) => (
  <div className="bg-secondary h-full">{children}</div>
);
const WhiteSquare = ({ children }: SquareProps) => (
  <div className="bg-primary h-full">{children}</div>
);
const Square = ({ children }: { children: ReactElement }) => (
  <div className="h-full w-1/8">{children}</div>
);
export const ChessBoard = ({ board }: { board: Square[][] }) => (
  <div className="border-1 border-black flex flex-col w-full h-full-w sm:w-452 sm:h-452">
    {board.map((row, i) => (
      <div key={i} className="flex flex-row w-full h-1/8">
        {row.map(({ piece }, j) => {
          const isWhite = (isEven(i) && isEven(j)) || (isOdd(i) && isOdd(j));
          const Component = isWhite ? WhiteSquare : BlackSquare;
          return (
            <Square key={j}>
              <Component>{piece}</Component>
            </Square>
          );
        })}
      </div>
    ))}
  </div>
);
