import { useEffect, useState } from 'react';
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
  const [game, setGame] = useState<undefined | ChessState>();
  // const [highlightedMoves, setHighlitedMoves] = useState<Array<Move>>([]);
  const [selected, setSelected] = useState<undefined | Coordinates>();
  const [promotionPieces, setPromotionPieces] = useState<
    undefined | Array<Move>
  >();

  // useEffect(() => {
  //   if (!game) {
  //     setGame(start({ mode, FEN }));
  //   }
  // }, [FEN, mode, game]);

  useEffect(() => {
    setGame(chess.start({ mode, FEN }));
  }, []);
  // useEffect(() => {
  //   setGame(start({ mode, FEN }));
  // }, [FEN, mode]);

  if (!game) return undefined;

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
      // if (selected && move.flags.capture) {
      //   if (move) {
      //     setGame(move(move.san[0], game));
      //   }
      //   setSelected(undefined);
      //   return;
      // }
      // if (!move) {
      //   setGame(clearBoard(game));
      //   setSelected(undefined);
      //   setHighlitedMoves([]);
      //   return;
      // }
      // if (move) {
      //   // setGame(highlightMoves(game.positions[pos.y][pos.x], clearBoard(game)));
      //   setSelected(pos);
      //   setHighlitedMoves(moves(pos, game));
      //   return;
      // }
    },
  };
};
