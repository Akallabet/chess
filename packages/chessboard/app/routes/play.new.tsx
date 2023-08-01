import { Form, useNavigate } from '@remix-run/react';
import { useState } from 'react';
import Modal from '~/shared/components/modal';

function NewGameModal() {
  const navigate = useNavigate();
  const [open] = useState(true);

  return (
    <Modal
      open={open}
      onClose={() => navigate('/play')}
      content={
        <Form action="/games/new" method="get">
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
                name="FEN"
                id="FEN"
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                defaultValue="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="FEN" className="sr-only">
                FEN
              </label>
              <select name="variant" id="variant">
                <option value="standard">Standard</option>
              </select>
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
        </Form>
      }
    />
  );
}

export default function NewGame() {
  return <NewGameModal />;
}
