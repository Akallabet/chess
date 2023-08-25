import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import * as chess from '@chess/chess';
import Modal from '~/shared/components/modal';
import { useLocalStorage } from '~/shared/hooks/use-local-storage';
import { nanoid } from 'nanoid';

function NewGameModal() {
  const navigate = useNavigate();
  const { setItem } = useLocalStorage();
  const [open] = useState(true);

  function onSubmit(e: BaseSyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const pgn = formData.get('pgn') as string;
    const fen = formData.get('fen') as string;
    const id = nanoid();

    const input = {
      PGN: pgn,
      FEN: fen,
      mode: 'standard',
      event: 'Local game',
      site: 'localhost',
      date: new Date().toISOString(),
      round: '1',
      white: 'White',
      black: 'Black',
    };

    const {
      FEN,
      initialFEN,
      mode,
      PGN,
      event,
      site,
      date,
      round,
      white,
      black,
      result,
      moves,
      currentMove,
    } = pgn ? chess.startFromPGN(input) : chess.start(input);
    setItem(`chess-game-${id}`, {
      FEN,
      initialFEN,
      PGN,
      mode,
      event,
      site,
      date,
      round,
      white,
      black,
      result,
      moves,
      currentMove,
    });
    navigate(`/games/${id}`);
  }

  return (
    <Modal
      open={open}
      onClose={() => navigate('/play')}
      content={
        <form action="/games/new?index" method="POST" onSubmit={onSubmit}>
          <h3
            className="text-base font-semibold leading-6 text-gray-900"
            id="modal-title"
          >
            Create a new game
          </h3>
          <div className="mt-2">
            <div className="w-full">
              <input
                type="text"
                name="fen"
                id="fen"
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="fen" className="sr-only">
                FEN
              </label>
              <select name="variant" id="variant">
                <option value="standard">Standard</option>
              </select>
              <textarea
                name="pgn"
                id="pgn"
                placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 a6"
                className="w-full"
              />
            </div>
          </div>
          <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="submit"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              Create
            </button>
          </div>
        </form>
      }
    />
  );
}

export default function NewGame() {
  return <NewGameModal />;
}
