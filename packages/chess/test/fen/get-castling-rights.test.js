import t from 'tap';
import { getCastlingRights } from '../../src/fen/get-castling-rights.js';

t.test('No castling rights', t => {
  t.same(getCastlingRights('k', { castlingRights: [] }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights: [] }).queenSide, false);
  t.end();
});

t.test('No castling rights for black king', t => {
  const castlingRights = ['K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, false);
  t.end();
});

t.test('No kingside castling rights for black king', t => {
  const castlingRights = ['q', 'K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, true);
  t.end();
});

t.test('No queenside castling rights for black king', t => {
  const castlingRights = ['k', 'K', 'Q'];
  t.same(getCastlingRights('k', { castlingRights }).kingSide, true);
  t.same(getCastlingRights('k', { castlingRights }).queenSide, false);
  t.end();
});

t.test('No kingside castling rights for white king', t => {
  const castlingRights = ['k', 'Q'];
  t.same(getCastlingRights('K', { castlingRights }).kingSide, false);
  t.same(getCastlingRights('K', { castlingRights }).queenSide, true);
  t.end();
});
