import { performance } from 'node:perf_hooks';
import { generateLegalMoves } from '../src/moves/generate-moves.js';
import { start } from '../src/start.js';

function kingUnderCheck() {
  const FEN = '6k1/3pp3/8/8/8/8/B7/3K4 b KQkq - 0 1';
  performance.measure('generateLegalMoves');
  generateLegalMoves({ x: 3, y: 1 }, start({ FEN }));
  console.log(performance.measure('generateLegalMoves'));
}

function performances() {
  console.log('Generate moves with king under check');
  kingUnderCheck();
}

performances();
