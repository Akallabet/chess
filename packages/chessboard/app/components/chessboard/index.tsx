import * as R from 'ramda';
import type { ChessBoardType } from '@chess/chess';
import Bishop from './bishop';
import King from './king';
import Knight from './knight';
import Pawn from './pawn';
import Queen from './queen';
import Rook from './rook';
import type { getMovesGameFn } from '../../use-game';

const isEven = (n: number) => n % 2 === 0;
const isOdd = (n: number) => !isEven(n);

const isWhitePiece = R.test(/[rnbqkp]/);

type MapOfComponents = {
  [key: string]: React.FC<any>;
};

const Pieces: MapOfComponents = {
  p: Pawn,
  b: Bishop,
  r: Rook,
  n: Knight,
  k: King,
  q: Queen,
};

const Piece = ({
  fill,
  stroke,
  piece,
}: {
  fill: string;
  stroke: string;
  piece: string;
}) => {
  const Component = Pieces[R.toLower(piece)];
  return <Component fill={fill} stroke={stroke} />;
};

type ChessBoardProps = {
  board: ChessBoardType;
  onSelect: (args: getMovesGameFn) => ChessBoardType;
};

export const ChessBoard = ({ board, onSelect }: ChessBoardProps) => (
  <div className="border-1 border-black mx-auto flex h-full-w w-full flex-col sm:h-452 sm:w-452">
    {board.map((row, i) => (
      <div
        key={i}
        className="flex h-1/8 w-full flex-row"
        onClick={() => console.log('lalalalal')}
      >
        {row.map(({ piece }, j) => {
          const isWhiteSquare =
            (isEven(i) && isEven(j)) || (isOdd(i) && isOdd(j));
          const bg = isWhiteSquare ? 'bg-primary' : 'bg-secondary';
          return (
            <div
              key={j}
              className={`h-full w-1/8 ${
                piece ? 'cursor-pointer' : 'cursor-auto'
              }`}
              onClick={() => onSelect({ piece, x: i, y: j })}
            >
              <div
                className={`${bg} flex h-full w-full items-center justify-center`}
              >
                {piece && (
                  <Piece
                    piece={piece}
                    fill={isWhitePiece(piece) ? '#ffffff' : '#000000'}
                    stroke={isWhitePiece(piece) ? '#000000' : '#ffffff'}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    ))}
  </div>
);
