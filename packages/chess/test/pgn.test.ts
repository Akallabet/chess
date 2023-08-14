import t from 'tap';
import { buildPGNString } from '../src/pgn.js';

t.test('Build PGN string', t => {
  t.plan(2);
  t.test('Default tags', t => {
    t.same(
      buildPGNString({}),
      '[Event "?"]\n[Site "?"]\n[Date "????.??.??"]\n[Round "?"]\n[White "?"]\n[Black "?"]\n[Result "*"]\n\n'
    );
    t.end();
  });
  t.test('Tags with values', t => {
    t.same(
      buildPGNString({
        event: 'Test',
        site: 'localhost',
        date: '2020.01.01',
        round: '1',
        white: 'White',
        black: 'Black',
        result: '1-0',
      }),
      '[Event "Test"]\n[Site "localhost"]\n[Date "2020.01.01"]\n[Round "1"]\n[White "White"]\n[Black "Black"]\n[Result "1-0"]\n\n'
    );
    t.end();
  });
  // t.test('Moves', t => {
  //   t.same(
  //     buildPGNString({
  //       event: 'Test',
  //       site: 'localhost',
  //       date: '2020.01.01',
  //       round: '1',
  //       white: 'White',
  //       black: 'Black',
  //       result: '1-0',
  //       moves: [
  //         { san: ['e4'], target: { x: 4, y: 6 }, piece: 'P', origin: { x: 4, y: 7 } },
  //         { san: ['e5'], target: { x: 4, y: 4 } },
  //         { san: ['Nf3'], target: { x: 5, y: 7 } },
  //         { san: ['Nc6'], target: { x: 2, y: 5 } },
  //     }),
  //     '[Event "Test"]\n[Site "localhost"]\n[Date "2020.01.01"]\n[Round "1"]\n[White "White"]\n[Black "Black"]\n[Result "1-0"]\n\n'
  //   );
  //   t.end();
  // });
});
