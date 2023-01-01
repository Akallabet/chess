import { Form } from '@remix-run/react';

const inputClassName = `w-full rounded border border-gray-500 px-2 py-1 text-lg`;

export const FENForm = () => {
  return (
    <Form method="get">
      <p>
        <label>
          Use FEN string
          <input name="fen" type="text" className={inputClassName} />
        </label>
      </p>
      <p>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300 text-black rounded px-4 py-2  "
        >
          GO
        </button>
      </p>
    </Form>
  );
};
