import Bishop from './bishop';
import King from './king';
import Knight from './knight';
import Pawn from './pawn';
import Queen from './queen';
import Rook from './rook';

type MapOfComponents = {
  [key: string]: React.FC<any>;
};

export const Pieces: MapOfComponents = {
  p: Pawn,
  b: Bishop,
  r: Rook,
  n: Knight,
  k: King,
  q: Queen,
};

export function Piece({
  fill,
  stroke,
  piece,
}: {
  fill: string;
  stroke: string;
  piece: string;
}) {
  const Component = Pieces[piece.toLowerCase()];
  return <Component fill={fill} stroke={stroke} />;
}
