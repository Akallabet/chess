import { useGame } from '../hooks/use-game';
import { Context } from './context';

export function Provider({
  children,
  gameId,
}: {
  children: React.ReactNode;
  gameId: string;
}) {
  const game = useGame(gameId);
  return game ? (
    <Context.Provider value={game}>{children}</Context.Provider>
  ) : null;
}
