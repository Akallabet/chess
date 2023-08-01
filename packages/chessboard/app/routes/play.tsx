import { Link, Outlet } from '@remix-run/react';

export default function Main() {
  return (
    <div>
      <div className="my-5" />
      <div className="flex justify-center">
        <button className="rounded bg-primary px-4 py-2 font-bold hover:bg-secondary">
          <Link to="new">New Game</Link>
        </button>
      </div>
      <Outlet />
    </div>
  );
}
