import { useContext } from 'react';
import { Context } from '../components/context';

export function useChess() {
  return useContext(Context);
}
