import { useEffect, useState } from 'react';
import chess from '@chess/chess';

export type getMovesGameFn = {
  piece: string;
  x: number;
  y: number;
};

export const useGame = (FEN: string) => {
  const [game, setGame] = useState(chess.start({ FEN }));
  useEffect(() => {
    setGame(chess.start({ FEN }));
  }, [FEN]);
  const { board } = game;
  return {
    board,
    getMoves: ({ piece, x, y }: getMovesGameFn) => {
      setGame(
        chess.getMoves(`${piece}${chess.files[y]}${chess.ranks[x]}`, game)
      );
    },
  };
};
