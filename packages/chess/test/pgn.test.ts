import t from 'tap';
import { buildPGNString } from '../src/pgn.js';

t.test('Build PGN string', t => {
  t.plan(4);
  t.test('Default tags', t => {
    t.same(
      buildPGNString({}),
      '[Event "?"]\n[Site "?"]\n[Date "????.??.??"]\n[Round "?"]\n[White "?"]\n[Black "?"]\n[Result "*"]\n\n'
    );
    t.end();
  });
  t.test('Tags with values', t => {
    t.same(
      '[Event "Test"]\n[Site "localhost"]\n[Date "2020.01.01"]\n[Round "1"]\n[White "White"]\n[Black "Black"]\n[Result "*"]\n\n',
      buildPGNString({
        event: 'Test',
        site: 'localhost',
        date: '2020.01.01',
        round: '1',
        white: 'White',
        black: 'Black',
        result: '*',
      })
    );
    t.end();
  });
  t.test('Moves', t => {
    t.same(
      '[Event "Test"]\n[Site "localhost"]\n[Date "2020.01.01"]\n[Round "1"]\n[White "White"]\n[Black "Black"]\n[Result "*"]\n1. e4 e5\n2. Nf3 Nc6\n\n',
      buildPGNString({
        event: 'Test',
        site: 'localhost',
        date: '2020.01.01',
        round: '1',
        white: 'White',
        black: 'Black',
        result: '*',
        moves: [
          {
            san: ['e4'],
            target: { x: 4, y: 6 },
            piece: 'P',
            origin: { x: 4, y: 7 },
          },
          {
            san: ['e5'],
            target: { x: 4, y: 4 },
            piece: 'p',
            origin: { x: 4, y: 2 },
          },
          {
            san: ['Nf3'],
            target: { x: 6, y: 5 },
            piece: 'N',
            origin: { x: 7, y: 7 },
          },
          {
            san: ['Nc6'],
            target: { x: 1, y: 5 },
            piece: 'n',
            origin: { x: 0, y: 7 },
          },
        ],
      })
    );
    t.end();
  });

  t.test('Moves with Checkmate', t => {
    t.same(
      [
        '[Event "Test"]\n[Site "localhost"]\n[Date "2020.01.01"]\n[Round "1"]\n[White "White"]\n[Black "Black"]\n[Result "1-0"]',
        '1. e4 e5\n2. Bc4 b6\n3. Qf3 g6\n4. Qxf7# 1-0\n\n',
      ].join('\n'),
      buildPGNString({
        event: 'Test',
        site: 'localhost',
        date: '2020.01.01',
        round: '1',
        white: 'White',
        black: 'Black',
        result: '1-0',
        moves: [
          {
            piece: 'P',
            origin: {
              y: 6,
              x: 4,
            },
            target: {
              y: 4,
              x: 4,
            },
            san: ['e4'],
          },
          {
            piece: 'p',
            origin: {
              y: 1,
              x: 4,
            },
            target: {
              y: 3,
              x: 4,
            },
            san: ['e5'],
          },
          {
            piece: 'B',
            origin: {
              y: 7,
              x: 5,
            },
            target: {
              y: 4,
              x: 2,
            },
            san: ['Bc4'],
          },
          {
            piece: 'p',
            origin: {
              y: 1,
              x: 1,
            },
            target: {
              y: 2,
              x: 1,
            },
            san: ['b6'],
          },
          {
            piece: 'Q',
            origin: {
              y: 7,
              x: 3,
            },
            target: {
              y: 5,
              x: 5,
            },
            san: ['Qf3'],
          },
          {
            piece: 'p',
            origin: {
              y: 1,
              x: 6,
            },
            target: {
              y: 2,
              x: 6,
            },
            san: ['g6'],
          },
          {
            piece: 'Q',
            origin: {
              y: 5,
              x: 5,
            },
            target: {
              y: 1,
              x: 5,
            },
            capture: true,
            checkmate: true,
            san: ['Qxf7#'],
          },
        ],
      })
    );
    t.end();
  });
});
