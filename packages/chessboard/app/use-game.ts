import { useEffect, useState } from 'react';
import chess from '@chess/chess';
import type { Coordinates, GameMode, ChessState } from '@chess/chess';

export const useGame = (FEN: string, mode: GameMode) => {
  const [game, setGame] = useState<undefined | ChessState>();
  const [selected, setSelected] = useState<Coordinates>();

  useEffect(() => {
    setGame(chess('start', { mode, FEN }));
  }, [FEN, mode]);

  if (!game) return {};

  const { board } = game;

  return {
    board,
    action: (
      { x, y }: Coordinates,
      {
        piece,
        move,
        capture,
      }: { piece: String; move: Boolean; capture: Boolean }
    ) => {
      if (capture || move) {
        setGame(chess('move', selected, { y, x }, game));
        setSelected(undefined);
        return;
      }
      if (!piece) {
        setGame(chess('clear', game));
        setSelected(undefined);
        return;
      }
      if (piece) {
        setGame(chess('highlight', { x, y }, game));
        setSelected({ x, y });
        return;
      }
    },
  };
};
