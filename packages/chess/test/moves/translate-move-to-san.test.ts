import t from 'tap';
import { translateMoveToSAN } from '../../src/moves/translate-move-to-san.js';
import { Move } from '../../src/types.js';

t.test('Generate SAN - only one pawn', t => {
  const move: Move = {
    piece: 'P',
    origin: { x: 2, y: 6 },
    target: { x: 2, y: 4 },
    flags: {},
    san: '',
  };
  const moveSquare = [move];
  const input = translateMoveToSAN(moveSquare, 0);
  t.same(input, 'c4');
  t.end();
});

t.test('Generate SAN - two knights with different files', t => {
  const moveSquare = [
    {
      piece: 'K',
      origin: { x: 2, y: 5 },
      target: { x: 4, y: 4 },
      flags: {},
      san: '',
    },
    {
      piece: 'K',
      origin: { x: 3, y: 6 },
      target: { x: 2, y: 5 },
      flags: {},
      san: '',
    },
  ];
  const input = translateMoveToSAN(moveSquare, 0);
  t.same(input, 'Kce4');
  t.end();
});

t.test('Generate SAN - two rooks with same file and different ranks', t => {
  const moveSquare = [
    {
      piece: 'R',
      origin: { x: 3, y: 3 },
      target: { x: 3, y: 4 },
      flags: {},
      san: '',
    },
    {
      piece: 'R',
      origin: { x: 3, y: 2 },
      target: { x: 3, y: 4 },
      flags: {},
      san: '',
    },
  ];
  const input = translateMoveToSAN(moveSquare, 0);
  t.same(input, 'R5d4');
  t.end();
});

t.test('Generate SAN - two rooks with same rank and different files', t => {
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
      san: '',
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
      san: '',
    },
  ];
  const input = translateMoveToSAN(moveSquare, 0);
  t.same(input, 'Rab2');
  t.end();
});

// t.test('Pawn capture', t => {
//   const move: Move = {
//     piece: 'P',
//     origin: { x: 2, y: 6 },
//     target: { x: 2, y: 4 },
//     flags: { capture: true },
//     san: '',
//   };
//   const moveSquare = [move];
//   const input = translateMoveToSAN(moveSquare, 0);
//   t.same(input, 'xc4');
//   t.end();
// });
