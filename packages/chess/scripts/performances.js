import { move, start, startFromPGN } from '../dist/index.js';
import { matches } from '../test/fixtures/pgn.js';

function simpleOneMove() {
  const begin = performance.now();
  const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  move('e4', start({ FEN, mode: 'standard' }));
  const end = performance.now();
  console.log(`Simple: ${end - begin}ms`);
}

function gameOfTheCentury() {
  const begin = performance.now();
  startFromPGN({ PGN: matches.gameOfTheCentury });

  const end = performance.now();
  console.log(`Match of the century: ${end - begin}ms`);
}

simpleOneMove();
gameOfTheCentury();
