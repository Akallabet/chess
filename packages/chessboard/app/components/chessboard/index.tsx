import * as R from 'ramda';
import type { ChessState } from '@chess/chess';
import Bishop from './bishop';
import King from './king';
import Knight from './knight';
import Pawn from './pawn';
import Queen from './queen';
import Rook from './rook';
import { FENForm } from '../fen';
import type { GameAction } from '~/use-game';

const isEven = (n: number) => n % 2 === 0;
const isOdd = (n: number) => !isEven(n);

const isWhitePiece = R.test(/[PRBNQK]/);

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

type ChessBoardProps = ChessState & {
  onCellClick: GameAction;
};

export const ChessBoard = ({
  board,
  positions,
  files,
  ranks,
  FEN,
  onCellClick,
}: ChessBoardProps) => (
  <div className="h-auto w-auto">
    <div className="border-1 border-black relative mx-auto flex h-full-w w-full flex-col sm:h-452 sm:w-452">
      {board.map((row, i) => (
        <div key={i} className="flex h-1/8 w-full flex-row">
          {row.map(({ piece, move, selected, capture }, j) => {
            const highlight = move || selected || capture;
            const isWhiteSquare =
              (isEven(i) && isEven(j)) || (isOdd(i) && isOdd(j));
            const bg =
              (isWhiteSquare && highlight && 'bg-primary-dark') ||
              (isWhiteSquare && 'bg-primary') ||
              (highlight && 'bg-secondary-dark') ||
              'bg-secondary';
            const handleClick = () => {
              onCellClick(positions[i][j], { piece, move, capture });
            };
            return (
              <div
                key={j}
                className={`relative h-full w-1/8 ${
                  piece ? 'cursor-pointer' : 'cursor-auto'
                }`}
              >
                <div
                  className={`relative ${bg} h-full w-full`}
                  onClick={handleClick}
                >
                  {j === 0 && (
                    <span className="leading-1 absolute left-0.5 top-0 text-xs">
                      {ranks[i]}
                    </span>
                  )}
                  {i === row.length - 1 && (
                    <div className="leading-1 absolute bottom-0 right-0.5 text-xs">
                      {files[j]}
                    </div>
                  )}
                  {piece && (
                    <div className="flex h-full w-full items-center justify-center">
                      <Piece
                        piece={piece}
                        fill={isWhitePiece(piece) ? '#ffffff' : '#000000'}
                        stroke={isWhitePiece(piece) ? '#000000' : '#ffffff'}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
    <div className="my-5" />
    <div className="mx-auto max-w-md">
      <FENForm FEN={FEN} />
    </div>
  </div>
);
