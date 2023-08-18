import { useEffect, useState } from 'react';
import type { ChessState, Coordinates, Move } from '@chess/chess';
import * as chess from '@chess/chess';
import { useLocalStorage } from '~/shared/hooks/use-local-storage';

export type GameAction = (pos: Coordinates, move: Move | undefined) => void;

export interface GameOutput {
  game: ChessState;
  selected?: Coordinates;
  highlightedMoves: Array<Move>;
  promotionMoves?: Move[];
  promote: (move: Move) => void;
  moveBack: () => void;
  moveForward: () => void;
  action: GameAction;
}

export const useGame = (gameId: string): GameOutput | undefined => {
  const { getItem, setItem } = useLocalStorage();
  const [game, setGame] = useState<ChessState | undefined>();
  const [selected, setSelected] = useState<undefined | Coordinates>();
  const [promotionPieces, setPromotionPieces] = useState<
    undefined | Array<Move>
  >();

  useEffect(() => {
    const item = getItem(`chess-game-${gameId}`);
    if (item) setGame(chess.start(item));
  }, []);

  useEffect(() => {
    if (game) {
      const {
        FEN,
        initialFEN,
        PGN,
        mode,
        event,
        date,
        site,
        white,
        black,
        result,
        moves,
        currentMove,
      } = game;
      setItem(`chess-game-${gameId}`, {
        FEN,
        initialFEN,
        PGN,
        mode,
        event,
        date,
        site,
        white,
        black,
        result,
        moves,
        currentMove,
      });
    }
  }, [game, setItem, gameId]);

  return game
    ? {
        game,
        selected,
        highlightedMoves: selected ? chess.moves(selected, game) : [],
        promotionMoves: promotionPieces,
        promote: move => {
          setGame(chess.move(move.san[0], game));
          setSelected(undefined);
          setPromotionPieces(undefined);
        },
        moveBack: () => {
          setGame(chess.moveBack(game));
          setSelected(undefined);
        },
        moveForward: () => {
          setGame(chess.moveForward(game));
          setSelected(undefined);
        },
        action: (pos, move) => {
          if (move && selected) {
            if (move.promotion) {
              setPromotionPieces(
                game.movesBoard[pos.y][pos.x].filter(
                  m => m.promotion && m.promotion[0]
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
