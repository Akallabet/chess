import { useEffect, useState } from 'react';
import type { ChessState, Coordinates, GameMode, Move } from '@chess/chess';
import { start, move, clearBoard, highlightMoves } from '@chess/chess';

export type GameAction = (
  pos: Coordinates,
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
  const [selected, setSelected] = useState<undefined | Coordinates>();

  // useEffect(() => {
  //   if (!game) {
  //     setGame(start({ mode, FEN }));
  //   }
  // }, [FEN, mode, game]);

  useEffect(() => {
    setGame(start({ mode, FEN }));
  }, []);
  // useEffect(() => {
  //   setGame(start({ mode, FEN }));
  // }, [FEN, mode]);

  if (!game) return undefined;

  return {
    ...game,
    action: (pos, { piece, move: moveType, capture }) => {
      if (selected && (capture || moveType)) {
        const originMove = game.movesBoard[pos.y][pos.x].find(
          (move: Move) =>
            move &&
            move.origin &&
            move.origin.y === selected.y &&
            move.origin.x === selected.x
        );

        if (originMove) {
          setGame(move(originMove.san, game));
        }
        setSelected(undefined);
        return;
      }
      if (!piece) {
        setGame(clearBoard(game));
        setSelected(undefined);
        return;
      }
      if (piece) {
        setGame(highlightMoves(game.positions[pos.y][pos.x], clearBoard(game)));
        setSelected(pos);
        return;
      }
    },
  };
};
