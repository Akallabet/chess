import { performance } from 'node:perf_hooks';
import { createMovesBoard } from '../src/moves/index.js';
import { start } from '../src/start.js';

function generateMoves(FEN) {
  const state = start({ FEN });
  performance.measure('generateLegalMoves');
  createMovesBoard(state);
  console.log(performance.measure('generateLegalMoves'));
}

function performances() {
  generateMoves('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
}

performances();
