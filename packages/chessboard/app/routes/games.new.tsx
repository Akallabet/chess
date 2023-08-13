import type { Variant } from '@chess/chess';
import type { LoaderArgs } from '@remix-run/node';
import { redirect, json } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import * as chess from '@chess/chess';
import { useEffect } from 'react';
import { useLocalStorage } from '~/shared/hooks/use-local-storage';
import { nanoid } from 'nanoid';

export const loader = ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const FEN = url.searchParams.get('FEN');
  const variant: Variant = url.searchParams.get('variant') as Variant;
  if (!FEN || !variant) {
    return redirect('/play');
  }
  const id = nanoid();
  return json({ FEN, variant, id });
};

export default function NewGame() {
  const { setItem } = useLocalStorage();
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    const { FEN, mode, PGN, event, site, date, round, white, black, result } =
      chess.start({
        FEN: data.FEN,
        mode: 'standard',
        event: 'Local game',
        site: 'localhost',
        date: new Date().toISOString(),
        round: '1',
        white: 'White',
        black: 'Black',
      });
    setItem(`chess-game-${data.id}`, {
      FEN,
      PGN,
      mode,
      event,
      site,
      date,
      round,
      white,
      black,
      result,
    });
    navigate(`/games/${data.id}`);
  }, []);

  return 'Loading';
}
