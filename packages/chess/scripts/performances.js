import { Chess } from 'chess.js';
import { move, start, startFromPGN } from '../dist/index.js';
import { matches } from '../test/fixtures/pgn.js';

export const data = {
  simple: {
    start: {
      FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      mode: 'standard',
    },
    moves: ['e4'],
  },
  gameOfTheCentury: {
    start: { PGN: matches.gameOfTheCentury },
  },
};

export const myImplementation = {
  withFEN(args) {
    const begin = performance.now();
    args.moves.reduce((state, san) => {
      return move({ san, state });
    }, start(args.start));
    const end = performance.now();
    const duration = end - begin;
    console.log(`Simple: ${duration}ms`);
    return duration;
  },
  withPGN(args) {
    const begin = performance.now();
    startFromPGN(args.start);

    const end = performance.now();
    const duration = end - begin;
    console.log(`Match of the century: ${duration}ms`);
    return duration;
  },
};

export const withChessJs = {
  withFEN(args) {
    const begin = performance.now();
    const chess = new Chess(args.start.FEN);

    for (const moveData of args.moves) {
      chess.move(moveData);
    }

    const end = performance.now();
    const duration = end - begin;
    console.log(`Simple: ${duration}ms`);
    return duration;
  },
  withPGN(args) {
    const begin = performance.now();
    const chess = new Chess();

    chess.loadPgn(args.start.PGN);

    const end = performance.now();
    const duration = end - begin;
    console.log(`Match of the century: ${duration}ms`);
    return duration;
  },
};
