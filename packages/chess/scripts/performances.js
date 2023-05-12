import { performance } from 'node:perf_hooks';
import { start } from '../dist/index.js';

function generateMoves(FEN) {
  performance.measure('generateLegalMoves');
  start({ FEN });
  console.log(performance.measure('generateLegalMoves'));
}

function performances() {
  generateMoves('rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1');
}

performances();
