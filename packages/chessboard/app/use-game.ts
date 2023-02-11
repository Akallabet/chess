import { useEffect, useState } from 'react';
import chess from '@chess/chess';
import type { Coordinates } from '@chess/chess';

export const useGame = (FEN: string) => {
  const [game, setGame] = useState(chess('start', { FEN }));
  const [selected, setSelected] = useState<Coordinates>();

  useEffect(() => {
    setGame(chess('start', { FEN }));
  }, [FEN]);

  const { board } = game;

  return {
    board,
    getMoves: ({ x, y }: Coordinates) => {
      setGame(chess('highlight', { x, y }, game));
      setSelected({ x, y });
    },
    clearBoard: () => {
      setGame(chess('clear', game));
      setSelected(undefined);
    },
    move: (target: Coordinates): void => {
      if (selected) setGame(chess('move', selected, target, game));
      setSelected(undefined);
    },
  };
};
