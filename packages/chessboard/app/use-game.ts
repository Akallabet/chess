import { useEffect, useState } from 'react';
import type { Address, ChessState, GameMode } from '@chess/chess';
import { start, move, clear, highlight } from '@chess/chess';

export type GameAction = (
  pos: Address,
  meta: {
    piece: string | undefined;
    move: boolean | undefined;
    capture: boolean | undefined;
  }
) => void;

interface GameOutput extends ChessState {
  action: GameAction;
}

export const useGame = (
  FEN: string,
  mode: GameMode
): GameOutput | undefined => {
  const [game, setGame] = useState<undefined | ChessState>();
  const [selected, setSelected] = useState<undefined | Address>();

  useEffect(() => {
    setGame(start({ mode, FEN }));
  }, [FEN, mode]);

  if (!game) return undefined;

  return {
    ...game,
    action: (addr, { piece, move: moveType, capture }) => {
      if (selected && (capture || moveType)) {
        setGame(move(selected, addr, game));
        setSelected(undefined);
        return;
      }
      if (!piece) {
        setGame(clear(game));
        setSelected(undefined);
        return;
      }
      if (piece) {
        setGame(highlight(addr, clear(game)));
        setSelected(addr);
        return;
      }
    },
  };
};
