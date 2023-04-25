import { fromFEN } from './fen/index.js';

export const start = initialState => {
  const { FEN } = initialState;
  const state = fromFEN(FEN);
  return { ...initialState, ...state };
};
