import t from 'tap';
import { start } from '../src/index.js';
import { translateMoveToSAN, translateSANToMove } from '../src/san.js';
import { Move } from '../src/types.js';

t.test('translateMoveToSAN', t => {
  t.plan(5);

  t.test('only one pawn', t => {
    const move: Move = {
      piece: 'P',
      origin: { x: 2, y: 6 },
      target: { x: 2, y: 4 },
      flags: {},
      san: [''],
    };
    const moveSquare = [move];
    const input = translateMoveToSAN(moveSquare, 0);
    t.same(input, ['c4']);
    t.end();
  });

  t.test(' two knights with different files and ranks', t => {
    const moveSquare = [
      {
        piece: 'N',
        origin: { x: 2, y: 5 },
        target: { x: 4, y: 4 },
        flags: {},
        san: [''],
      },
      {
        piece: 'N',
        origin: { x: 6, y: 3 },
        target: { x: 4, y: 4 },
        flags: {},
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    t.same(input, ['Ne4']);
    t.end();
  });

  t.test(' two rooks with same file and different ranks', t => {
    const moveSquare = [
      {
        piece: 'R',
        origin: { x: 3, y: 3 },
        target: { x: 3, y: 4 },
        flags: {},
        san: [''],
      },
      {
        piece: 'R',
        origin: { x: 3, y: 7 },
        target: { x: 3, y: 4 },
        flags: {},
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    t.same(input, ['R5d4']);
    t.end();
  });

  t.test('two rooks with same rank and different files', t => {
    const moveSquare = [
      {
        piece: 'R',
        origin: {
          x: 0,
          y: 6,
        },
        target: {
          x: 1,
          y: 6,
        },
        flags: {
          move: true,
        },
        san: [''],
      },
      {
        piece: 'R',
        origin: {
          x: 7,
          y: 6,
        },
        target: {
          x: 1,
          y: 6,
        },
        flags: {
          move: true,
        },
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    t.same(input, ['Rab2']);
    t.end();
  });

  t.test('Pawn capture', t => {
    const move: Move = {
      piece: 'P',
      origin: { x: 2, y: 6 },
      target: { x: 3, y: 5 },
      flags: { capture: true },
      san: [''],
    };
    const moveSquare = [move];
    const input = translateMoveToSAN(moveSquare, 0);
    t.same(input, ['cxd3']);
    t.end();
  });
});

t.test('translateSANToMove', t => {
  t.plan(6);

  t.test('SAN - Wrong format', t => {
    const FEN = '3k4/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
    const san = 'Qp1e8';
    const game = start({ FEN, mode: 'standard' });
    t.throws(() => translateSANToMove(san, game.movesBoard));
    t.end();
  });

  t.test('SAN - piece - from (file+rank) - to (file+rank)', t => {
    const FEN = '2k5/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
    const san = 'Qe7';
    const expected = {
      piece: 'Q',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 1 },
      san: ['Qe7'],
      flags: { move: true },
    };

    const game = start({ FEN, mode: 'standard' });
    const result = translateSANToMove(san, game.movesBoard);
    t.same(result, expected);
    t.end();
  });

  t.test('SAN - piece with destination file and rank i.e. "Qe8"', t => {
    const FEN = '2k5/2N5/8/8/8/8/8/4QK2 w KQkq - 0 1';
    const san = 'Qe7';
    const expected = {
      piece: 'Q',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 1 },
      san: [san],
      flags: { move: true },
    };

    const game = start({ FEN, mode: 'standard' });
    t.same(translateSANToMove(san, game.movesBoard), expected);
    t.end();
  });

  t.test('Pawn i.e. "c3"', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const san = 'c3';
    const expected = {
      piece: 'P',
      origin: { x: 2, y: 6 },
      target: { x: 2, y: 5 },
      san: [san],
      flags: { move: true },
    };
    t.same(
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard),
      expected
    );
    t.end();
  });

  t.test('SAN - Pawn wrong format i.e. "c3"', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
    const san = 'h5';
    t.throws(() =>
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard)
    );
    t.end();
  });

  t.test('SAN - Bishop unique move', t => {
    const FEN = 'rnbqkbnr/pppp2pp/4pp2/8/8/4PP2/PPPP2PP/RNBQKBNR w KQkq - 0 1';
    const san = 'Bd3';
    const expected = {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 3, y: 5 },
      san: [san],
      flags: { move: true },
    };
    t.same(
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard),
      expected
    );
    t.end();
  });
});
