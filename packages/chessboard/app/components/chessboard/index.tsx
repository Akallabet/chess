import { FENForm } from '../fen';
import type { Files, Ranks, Move, Square } from '@chess/chess';
import { Promotion } from './promotion';
import { Piece } from './piece';
import type { GameAction } from '~/shared/hooks/use-game';

const isEven = (n: number) => n % 2 === 0;
const isOdd = (n: number) => !isEven(n);

const isWhitePiece = (piece: string): boolean => /[PRBNQK]/.test(piece);

interface ChessBoardProps {
  board: Square[][];
  highlightedMoves: Array<Move>;
  promotionMoves: Array<Move>;
  files: Files;
  ranks: Ranks;
  FEN: string;
  onPromotion: (move: Move) => void;
  onCellClick: GameAction;
}

export const ChessBoard = ({
  board,
  highlightedMoves,
  promotionMoves,
  files,
  ranks,
  FEN,
  onPromotion,
  onCellClick,
}: ChessBoardProps) => (
  <div className="h-auto w-auto">
    {promotionMoves && promotionMoves.length > 0 && (
      <Promotion moves={promotionMoves} onSelect={move => onPromotion(move)} />
    )}
    <div className="border-1 border-black relative mx-auto flex h-full-w w-full flex-col sm:h-452 sm:w-452">
      {board.map((row, y) => (
        <div key={y} className="flex h-1/8 w-full flex-row">
          {row.map((piece, x) => {
            const move = highlightedMoves.find(
              move => move.target.x === x && move.target.y === y
            );
            const isWhiteSquare =
              (isEven(y) && isEven(x)) || (isOdd(y) && isOdd(x));
            const bg =
              (isWhiteSquare && move && 'bg-primary-dark') ||
              (isWhiteSquare && 'bg-primary') ||
              (move && 'bg-secondary-dark') ||
              'bg-secondary';
            const handleClick = () => {
              onCellClick({ x, y }, move);
            };
            return (
              <div
                key={x}
                className={`relative h-full w-1/8 ${
                  piece ? 'cursor-pointer' : 'cursor-auto'
                }`}
              >
                <div
                  className={`relative ${bg} h-full w-full`}
                  onClick={handleClick}
                >
                  {x === 0 && (
                    <span className="leading-1 absolute left-0.5 top-0 text-xs">
                      {ranks[y]}
                    </span>
                  )}
                  {y === row.length - 1 && (
                    <div className="leading-1 absolute bottom-0 right-0.5 text-xs">
                      {files[x]}
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
