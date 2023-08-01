import { useMemo, useState } from 'react';
import type { ChessState, Coordinates, GameMode, Move } from '@chess/chess';
import * as chess from '@chess/chess';

export type GameAction = (pos: Coordinates, move: Move) => void;

interface GameOutput extends ChessState {
  selected?: Coordinates;
  highlightedMoves: Array<Move>;
  promotionMoves?: Array<Move>;
  promote: (move: Move) => void;
  action: GameAction;
}

export const useGame = (
  FEN: string,
  mode: GameMode
): GameOutput | undefined => {
  const initialGame = useMemo(() => {
    return chess.start({ mode, FEN });
  }, [FEN, mode]);
  const [game, setGame] = useState<ChessState>(initialGame);
  const [selected, setSelected] = useState<undefined | Coordinates>();
  const [promotionPieces, setPromotionPieces] = useState<
    undefined | Array<Move>
  >();

  const highlightedMoves = selected ? chess.moves(selected, game) : [];

  return {
    ...game,
    selected,
    highlightedMoves,
    promotionMoves: promotionPieces,
    promote: move => {
      setGame(chess.move(move.san[0], game));
      setSelected(undefined);
      setPromotionPieces(undefined);
    },
    action: (pos, move) => {
      if (move && selected) {
        if (move.flags.promotion) {
          setPromotionPieces(
            game.movesBoard[pos.y][pos.x].filter(m => m.flags.promotion)
          );
          return;
        }
        setGame(chess.move(move.san[0], game));
        setSelected(undefined);
        return;
      }
      setSelected(pos);
    },
  };
};
