import { useEffect, useState } from 'react';
import chess from '@chess/chess';
import type { Position, GameMode, ChessStateOutput } from '@chess/chess';

type GameAction = (
  pos: Position,
  meta: { piece: String; move: Boolean; capture: Boolean }
) => void;

type GameOutput =
  | (ChessStateOutput & {
      action: GameAction;
    })
  | undefined;

export const useGame = (FEN: string, mode: GameMode): GameOutput => {
  const [game, setGame] = useState<undefined | ChessStateOutput>();
  const [selected, setSelected] = useState<undefined | Position>();

  useEffect(() => {
    setGame(chess('start', { mode, FEN }));
  }, [FEN, mode]);

  if (!game) return undefined;

  return {
    ...game,
    action: (addr, { piece, move, capture }) => {
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
