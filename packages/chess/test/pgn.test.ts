import t from 'tap';
import { buildPGNString, fromPGNString } from '../src/pgn.js';

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
            FEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
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
            FEN: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
          },
          {
            piece: 'N',
            origin: {
              y: 7,
              x: 6,
            },
            target: {
              x: 5,
              y: 5,
            },
            san: ['Nf3'],
            FEN: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
          },
          {
            piece: 'n',
            origin: {
              y: 0,
              x: 1,
            },
            target: {
              x: 2,
              y: 2,
            },
            san: ['Nc6'],
            FEN: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
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
            FEN: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
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
            FEN: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
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
            FEN: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR b KQkq - 1 2',
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
            FEN: 'rnbqkbnr/p1pp1ppp/1p6/4p3/2B1P3/8/PPPP1PPP/RNBQK1NR w KQkq - 0 3',
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
            FEN: 'rnbqkbnr/p1pp1ppp/1p6/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR b KQkq - 1 3',
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
            FEN: 'rnbqkbnr/p1pp1p1p/1p4p1/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 4',
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
            FEN: 'rnbqkbnr/p1pp1Q1p/1p4p1/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
          },
        ],
      })
    );
    t.end();
  });
});

t.test('From PGN string', t => {
  t.plan(2);

  t.test('Couple of moves', t => {
    const pgn = `[Event "Local game"]
[Site "localhost"]
[Date "2023-08-18T20:58:38.737Z"]
[Round "?"]
[White "White"]
[Black "Black"]
[Result "1-0"]

1. e4 e5 2. Bc4 b6 3. Qf3
g6 4. Qxf7# 1-0`;
    const state = fromPGNString(pgn);
    t.same(
      'rnbqkbnr/p1pp1Q1p/1p4p1/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4',
      state.FEN
    );
    t.end();
  });
  t.test(
    'Fischer, Robert J. vs. Spassky, Boris V. Belgrade, Serbia JUG: F/S Return Match: 1992.11.04',
    t => {
      const pgn = `[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
Nf2 42. g4 Bd3 43. Re6 1/2-1/2`;
      const state = fromPGNString(pgn);
      t.same('8/8/4R1p1/2k3p1/1p4P1/1P1b1P2/3K1n2/8 b - - 2 43', state.FEN);
      t.has(state, {
        event: 'F/S Return Match',
        site: 'Belgrade, Serbia JUG',
        date: '1992.11.04',
        round: '29',
        white: 'Fischer, Robert J.',
        black: 'Spassky, Boris V.',
        result: '1/2-1/2',
      });
      t.end();
    }
  );
});
