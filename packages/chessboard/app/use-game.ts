import { useEffect, useState } from 'react';
import chess from '@chess/chess';
import type { Position, GameMode, ChessStateOutput } from '@chess/chess';

export const useGame = (FEN: string, mode: GameMode) => {
  const [game, setGame] = useState<undefined | ChessStateOutput>();
  const [selected, setSelected] = useState<undefined | Position>();

  useEffect(() => {
    setGame(chess('start', { mode, FEN }));
  }, [FEN, mode]);

  if (!game) return {};

  const { board, positions, ranks, files } = game;

  return {
    files,
    ranks,
    board,
    positions,
    action: (
      addr: Position,
      {
        piece,
        move,
        capture,
      }: { piece: String; move: Boolean; capture: Boolean }
    ) => {
      if (selected && (capture || move)) {
        setGame(chess('move', selected, addr, game));
        setSelected(undefined);
        return;
      }
      if (!piece) {
        setGame(chess('clear', game));
        setSelected(undefined);
        return;
      }
      if (piece) {
        setGame(chess('highlight', addr, game));
        setSelected(addr);
        return;
      }
    },
  };
};
