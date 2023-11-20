import { Chess } from 'chess.js';
import { move, start, startFromPGN } from '../dist/index.js';
import { matches } from '../test/fixtures/pgn.js';

const data = {
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

const myImplementation = {
  withFEN(args) {
    const begin = performance.now();
    args.moves.reduce((state, moveData) => {
      return move(moveData, state);
    }, start(args.start));
    const end = performance.now();
    console.log(`Simple: ${end - begin}ms`);
  },
  withPGN(args) {
    const begin = performance.now();
    startFromPGN(args.start);

    const end = performance.now();
    console.log(`Match of the century: ${end - begin}ms`);
  },
};

const withChessJs = {
  withFEN(args) {
    const begin = performance.now();
    const chess = new Chess(args.start.FEN);

    args.moves.forEach(moveData => {
      return chess.move(moveData);
    });

    const end = performance.now();
    console.log(`Simple: ${end - begin}ms`);
  },
  withPGN(args) {
    const begin = performance.now();
    const chess = new Chess();

    chess.loadPgn(args.start.PGN);

    const end = performance.now();
    console.log(`Match of the century: ${end - begin}ms`);
  },
};

console.log('My implementation');
myImplementation.withFEN(data.simple);
myImplementation.withPGN(data.gameOfTheCentury);

console.log('Chess.js');
withChessJs.withFEN(data.simple);
withChessJs.withPGN(data.gameOfTheCentury);
