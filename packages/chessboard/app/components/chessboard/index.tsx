import * as R from 'ramda';
import Bishop from './bishop';
import King from './king';
import Knight from './knight';
import Pawn from './pawn';
import Queen from './queen';
import Rook from './rook';

interface Square {
  piece: string;
}

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

export const ChessBoard = ({ board }: { board: Square[][] }) => (
  <div className="border-1 border-black flex flex-col w-full h-full-w sm:w-452 sm:h-452">
    {board.map((row, i) => (
      <div key={i} className="flex flex-row w-full h-1/8">
        {row.map(({ piece }, j) => {
          const isWhiteSquare =
            (isEven(i) && isEven(j)) || (isOdd(i) && isOdd(j));
          const bg = isWhiteSquare ? 'bg-primary' : 'bg-secondary';
          return (
            <div key={j} className="h-full w-1/8">
              <div className={`${bg} h-full`}>
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
