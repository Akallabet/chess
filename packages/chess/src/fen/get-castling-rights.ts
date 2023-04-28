import * as R from 'ramda';
import { FENState } from '../types.js';
import { isWhitePiece, isBlackPiece } from '../utils/index.js';

export const getCastlingRights = (king: string, state: FENState) => {
  const { castlingRights } = state;
  if (!castlingRights.length) return { kingSide: false, queenSide: false };
  if (isWhitePiece(king))
    return {
      kingSide: R.includes('K', castlingRights),
      queenSide: R.includes('Q', castlingRights),
    };
  if (isBlackPiece(king)) {
    return {
      kingSide: R.includes('k', castlingRights),
      queenSide: R.includes('q', castlingRights),
    };
  }
  return { kingSide: false, queenSide: false };
};
