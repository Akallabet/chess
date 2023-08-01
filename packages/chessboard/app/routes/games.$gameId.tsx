import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export const loader = ({ params }: LoaderArgs) => {
  return json(params);
};

export default function Game() {
  const game = useLoaderData<typeof loader>();
  return 'Game';
}
