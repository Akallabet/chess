import test from 'node:test';
import { strict as assert } from 'node:assert';
import { piecesMap } from '../src/constants.js';
import { start } from '../src/index.js';
import { translateMoveToSAN, translateSANToMove } from '../src/san.js';
import { Move } from '../src/types.js';

test('translateMoveToSAN', async t => {
  await t.test('only one pawn', () => {
    const move: Move = {
      piece: piecesMap.P,
      origin: { x: 2, y: 6 },
      target: { x: 2, y: 4 },
      san: [''],
    };
    const moveSquare = [move];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['c4']);
  });

  await t.test('two pawns same rank different file', () => {
    const moveSquare = [
      {
        piece: piecesMap.P,
        origin: { x: 0, y: 2 },
        target: { x: 1, y: 3 },
        capture: true,
        san: [''],
      },
      {
        piece: piecesMap.P,
        origin: { x: 2, y: 2 },
        target: { x: 1, y: 3 },
        capture: true,
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['axb5']);
  });
  await t.test(' two rooks with same file and different ranks', () => {
    const moveSquare = [
      {
        piece: piecesMap.R,
        origin: { x: 3, y: 3 },
        target: { x: 3, y: 4 },
        san: [''],
      },
      {
        piece: piecesMap.R,
        origin: { x: 3, y: 7 },
        target: { x: 3, y: 4 },
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['R5d4']);
  });

  await t.test('two rooks with same rank and different files', () => {
    const moveSquare = [
      {
        piece: piecesMap.R,
        origin: {
          x: 0,
          y: 6,
        },
        target: {
          x: 1,
          y: 6,
        },
        san: [''],
      },
      {
        piece: piecesMap.R,
        origin: {
          x: 7,
          y: 6,
        },
        target: {
          x: 1,
          y: 6,
        },
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['Rab2']);
  });

  await t.test('two knight with different files and ranks', () => {
    const moveSquare = [
      {
        piece: piecesMap.N,
        origin: {
          x: 1,
          y: 0,
        },
        target: {
          x: 3,
          y: 1,
        },
        san: [''],
      },
      {
        piece: piecesMap.N,
        origin: {
          x: 5,
          y: 2,
        },
        target: {
          x: 3,
          y: 1,
        },
        san: [''],
      },
    ];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['Nbd7']);
  });

  await t.test('Pawn capture', () => {
    const move: Move = {
      piece: piecesMap.P,
      origin: { x: 2, y: 6 },
      target: { x: 3, y: 5 },
      capture: true,
      san: [''],
    };
    const moveSquare = [move];
    const input = translateMoveToSAN(moveSquare, 0);
    assert.deepEqual(input, ['cxd3']);
  });
});

test('translateSANToMove', async t => {
  await t.test('SAN - Wrong format', t => {
    const FEN = '3k4/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
    const san = 'Qp1e8';
    const game = start({ FEN, mode: 'standard' });
    try {
      translateSANToMove(san, game.movesBoard);
    } catch (e) {
      assert.strictEqual(
        e.message,
        'Qp1e8 does not exist in the current position'
      );
    }
  });

  await t.test('SAN - piece - from (file+rank) - to (file+rank)', t => {
    const FEN = '2k5/8/8/8/8/8/8/3KQ3 w KQkq - 0 1';
    const san = 'Qe7';
    const expected = {
      piece: 'Q',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 1 },
      san: ['Qe7'],
    };

    const game = start({ FEN, mode: 'standard' });
    const result = translateSANToMove(san, game.movesBoard);
    assert.deepEqual(result, expected);
  });

  await t.test('SAN - piece with destination file and rank i.e. "Qe8"', t => {
    const FEN = '2k5/2N5/8/8/8/8/8/4QK2 w KQkq - 0 1';
    const san = 'Qe7';
    const expected = {
      piece: 'Q',
      origin: { x: 4, y: 7 },
      target: { x: 4, y: 1 },
      san: [san],
    };

    const game = start({ FEN, mode: 'standard' });
    assert.deepEqual(translateSANToMove(san, game.movesBoard), expected);
  });

  await t.test('Pawn i.e. "c3"', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const san = 'c3';
    const expected = {
      piece: 'P',
      origin: { x: 2, y: 6 },
      target: { x: 2, y: 5 },
      san: [san],
    };
    assert.deepEqual(
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard),
      expected
    );
  });

  await t.test('SAN - Pawn wrong format i.e. "c3"', t => {
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR w KQkq - 0 1';
    const san = 'h5';
    try {
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard);
    } catch (e) {
      assert.strictEqual(
        e.message,
        'h5 does not exist in the current position'
      );
    }
  });

  await t.test('SAN - Bishop unique move', t => {
    const FEN = 'rnbqkbnr/pppp2pp/4pp2/8/8/4PP2/PPPP2PP/RNBQKBNR w KQkq - 0 1';
    const san = 'Bd3';
    const expected = {
      piece: 'B',
      origin: { x: 5, y: 7 },
      target: { x: 3, y: 5 },
      san: [san],
    };
    assert.deepEqual(
      translateSANToMove(san, start({ FEN, mode: 'standard' }).movesBoard),
      expected
    );
  });
});
