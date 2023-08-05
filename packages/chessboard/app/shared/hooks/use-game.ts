import { useEffect, useState } from 'react';
import type { ChessState, Coordinates, Move } from '@chess/chess';
import * as chess from '@chess/chess';
import { useLocalStorage } from './use-local-storage';

export type GameAction = (pos: Coordinates, move: Move | undefined) => void;

interface GameOutput extends ChessState {
  selected?: Coordinates;
  highlightedMoves: Array<Move>;
  promotionMoves?: Array<Move>;
  promote: (move: Move) => void;
  action: GameAction;
}

export const useGame = (gameId: string): GameOutput | undefined => {
  const { getItem } = useLocalStorage();
  const [game, setGame] = useState<ChessState | undefined>();
  const [selected, setSelected] = useState<undefined | Coordinates>();
  const [promotionPieces, setPromotionPieces] = useState<
    undefined | Array<Move>
  >();

  useEffect(() => {
    const item = getItem(`chess-game-${gameId}`);
    if (item) setGame(item);
  }, []);

  return game
    ? {
        ...game,
        selected,
        highlightedMoves: selected ? chess.moves(selected, game) : [],
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
                game.movesBoard[pos.y][pos.x].filter(
                  m => m.flags.promotion && m.flags.promotion[0]
                )
              );
              return;
            }
            setGame(chess.move(move.san[0], game));
            setSelected(undefined);
            return;
          }
          setSelected(pos);
        },
      }
    : undefined;
};
