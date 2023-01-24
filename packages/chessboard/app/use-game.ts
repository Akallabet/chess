import { useEffect, useState } from 'react';
import chess from '@chess/chess';

export type getMovesGameFn = {
  x: number;
  y: number;
};

export const useGame = (FEN: string) => {
  const [game, setGame] = useState(chess('start', { FEN }));
  useEffect(() => {
    setGame(chess('start', { FEN }));
  }, [FEN]);
  const { board } = game;
  return {
    board,
    getMoves: ({ x, y }: getMovesGameFn) => {
      setGame(chess('highlight', { x, y }, game));
    },
    clearBoard: () => {
      setGame(chess('clear', game));
    },
  };
};
