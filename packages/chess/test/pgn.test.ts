import t from 'tap';
import { buildPGNString, fromPGNString, parseMoveText } from '../src/pgn.js';

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

t.only('MoveText generation', t => {
  t.plan(5);

  t.test('Simple series of moves', t => {
    const moveText = '1. e4 e5 2. Bc4 b6 3. Qf3 g6';
    const result = parseMoveText(moveText);
    t.same(6, result.length);
    t.same('e4', result[0].san);
    t.same('Bc4', result[2].san);
    t.end();
  });
  t.test('Short inline comment within {}', t => {
    const moveText = '1. e4 e5 2. Bc4 b6 {This is a short comment} 3. Qf3 g6';
    const result = parseMoveText(moveText);
    t.same(6, result.length);
    t.same('e4', result[0].san);
    t.same('b6', result[3].san);
    t.same('This is a short comment', result[3].comment);
    t.end();
  });
  t.test('Long comment over 2 lines within {}', t => {
    const moveText = `1. e4 e5 2. Bc4 {This is a longer comment.
 It is divided in two lines} b6 3. Qf3 g6`;
    const result = parseMoveText(moveText);
    t.same(6, result.length);
    t.same('e4', result[0].san);
    t.same('b6', result[3].san);
    t.same(
      'This is a longer comment. It is divided in two lines',
      result[2].comment
    );
    t.end();
  });
  t.test('Split move annotation', t => {
    const moveText = `1. e4 e5 2. Bc4 2... b6 {This is a longer comment.
  It is divided in two lines} 3. Qf3 g6`;
    const result = parseMoveText(moveText);
    t.same(6, result.length);
    t.same('e4', result[0].san);
    t.same('b6', result[3].san);
    t.same(
      'This is a longer comment. It is divided in two lines',
      result[3].comment
    );
    t.end();
  });
  t.only('Ignore move variations', t => {
    const moveText = `1. e4 e5 2. Bc4 2... b6 {This is a longer comment.
  It is divided in two lines} 3. Qf3 (3. Qd2 {Move variation}) g6`;
    const result = parseMoveText(moveText);
    t.same(6, result.length);
    t.same('e4', result[0].san);
    t.same('b6', result[3].san);
    t.same('Qf3', result[4].san);
    t.same('', result[4].comment);
    t.same('g6', result[5].san);
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
  //   t.test('The game of the century', t => {
  //     const pgn = `[Event "World Championship 28th"]
  // [Site "Reykjavik"]
  // [Date "1972.08.31"]
  // [Round "21"]
  // [White "Boris Spassky"]
  // [Black "Bobby Fischer"]
  // [Result "0-1"]
  // [ECO "B46"]
  // [Annotator "Rafael Leitão"]
  //
  // 1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6 5. Nc3 Nc6 {This variation was tested
  // in two games by GM Richard Rapport in the last Candidates Tournament. I have
  // played this position with Black more or less fifty times during my career.
  // Fischer, however, played it only this time.} 6. Be3 (6. Nxc6 {This is the main
  // move and it's always been what bothered me the most.}) 6... Nf6 7. Bd3 (7. Qd2
  // {This is one of the most dangerous moves when followed by f3 and g4. But what is
  // now known as the English Attack was not yet popular in the 1970s. It began to be
  // explored more during the 1980s, thanks to several English chess players who
  // began implementing this setup against various Sicilian forms.}) 7... d5 $6
  // {Interestingly, before the match this move had only been played in two games by
  // Adolph Anderssen in the 19th century. We have an unexplored position on the
  // board that Spassky did not expect. This central break leads to a somewhat worse
  // position for Black with an isolated queen's pawn.} (7... Qc7 {is the main
  // move.}) 8. exd5 exd5 {The best way to recapture. If Black takes with the knight,
  // White gets the advantage in many ways.} (8... Nxd5 $6 9. Nxd5 (9. Nxc6 bxc6 10.
  // Nxd5 $1 cxd5 11. Bd4 {And the white bishops aim dangerously towards the
  // kingside.}) 9... Qxd5 10. Nxc6 Qxc6 11. Qg4 $1 {with a clear advantage for
  // White.}) 9. O-O $6 (9. Qd2 $1 {With the idea of castling on the queenside and then
  // starting an advance with f3-g4, is a more promising plan for White.}) 9... Bd6
  // {Now Black has no big problems.The legendary GM Ulf Andersson, a specialist in
  // Sicilian, lost three games with the black pieces in this position, but in all of
  // them he managed to achieve a good position in the opening.} 10. Nxc6 (10. Bf5
  // O-O 11. Bxc8 Rxc8 12. Nxc6 bxc6 {with a comfortable position in
  // Ivanovic-Andersson, Bugojno 1984.}) (10. Be2 h6 11. Re1 O-O 12. Bf3 Re8 {with
  // equal chances in Timman-Andersson, London 1984.}) (10. h3 O-O 11. Re1 Re8 12.
  // Nxc6 bxc6 {with a good position for Black in Topalov-Andersson, Monte Carlo
  // 1997.}) 10... bxc6 11. Bd4 O-O 12. Qf3 $6 (12. Na4 $5 {controlling the c5 square
  // and preparing the c2-c4 advance was a more interesting option. Anyway, Black has
  // a good position.} 12... Rb8 13. b3 Qe7 {with equality.}) 12... Be6 $6 (12... Ng4 $1
  // {This move would create serious problems for White. The idea is:} 13. h3 Qg5 $3
  // {A brilliant move $1 The knight cannot be captured and White must play accurately
  // so as not to lose immediately.} (13... Nh2 $2 14. Qh5 g6 15. Qh6) 14. g3 $1 (14.
  // hxg4 $2 Bxg4 15. Qe3 Bf4 $1 16. Bxh7+ {The only way to free up space for the queen.}
  // 16... Kxh7 17. Qd3+ Kg8 {And Black has a decisive attack with the bishops aiming
  // for White's king.}) 14... Ne5 15. Bxe5 Bxe5 {with a comfortable advantage thanks
  // to the pair of bishops.}) 13. Rfe1 {Capturing at f6 immediately was also
  // possible. After} (13. Bxf6 Qxf6 14. Qxf6 gxf6 15. Ne2 c5 16. Rad1 Be5 {Black has
  // a slight pressure, but a draw is the most likely outcome.}) 13... c5 14. Bxf6
  // Qxf6 15. Qxf6 gxf6 16. Rad1 Rfd8 (16... Be5 {is a serious alternative.} 17.
  // Be2 $5 Rab8 (17... Bxc3 18. bxc3 $12) 18. Nxd5 Rxb2 19. Bxa6 {and White should be
  // able to hold the position.}) 17. Be2 $1 {Spassky plays the next moves accurately.
  // He needs to be fast, otherwise the bishop's pair can be dangerous, especially in
  // the hands of Fischer, who was an expert at handling the advantage of a bishop
  // against a knight.} 17... Rab8 18. b3 c4 {A critical moment.} 19. Nxd5 $1 {It's
  // necessary to sacrifice the exchange to achieve an equal game.} (19. bxc4 $2 Bb4
  // {and Black wins material.}) (19. Na4 $6 Bf5 {and the bishops are too strong.})
  // 19... Bxd5 20. Rxd5 Bxh2+ 21. Kxh2 Rxd5 22. Bxc4 {White is very active and has
  // no problems holding this endgame.} 22... Rd2 23. Bxa6 (23. Bd3 $5 {this is a very
  // interesting tactical idea which guarantees a draw in a rook endgame.} 23... Rxf2
  // 24. Rd1 $1 {Now the f2-rook has no squares.} (24. Kg3 {is also enough for a
  // draw.}) 24... Rc8 $1 (24... Rf4 $2 25. Bxa6 {And with three passed pawns, White has
  // the advantage.}) 25. Kg3 Rfxc2 26. Bxc2 Rxc2 {and this ending is drawn in
  // different ways. For example:} 27. Rd6 (27. a4 Rc3+ 28. Kf2 Rxb3 29. Rd6 Kg7 30.
  // Rxa6 {with an easy draw, since Black's structure is broken.}) 27... Rxa2 28.
  // Rxf6 Kg7 29. Rb6 {followed by b4-b5 and the exchange of pawns on the queenside,
  // leading to an easy theoretical draw.}) 23... Rxc2 24. Re2 Rxe2 25. Bxe2 {This
  // ending is easily drawn, as the queenside pawns are a constant danger from
  // Black's rook. In addition, the broken structure on the kingside hinders any
  // serious victory attempt. It's surprising that Spassky loses this position.}
  // 25... Rd8 26. a4 Rd2 27. Bc4 Ra2 {The rook must get behind the pawns, preventing
  // them from advancing.} 28. Kg3 Kf8 29. Kf3 Ke7 30. g4 $6 {An unnecessary move,
  // despite not being the decisive mistake. It's simpler to leave the pawn on g3.}
  // (30. g3 f5 31. Bd3 Kf6 32. Bc4 {and Black has no winning plan.}) 30... f5 $1 {Now
  // Fischer creates a passed pawn.} 31. gxf5 f6 32. Bg8 h6 33. Kg3 Kd6 34. Kf3 $4
  // {This is a blunder. White loses by one detail: the bad positioning of the
  // g8-bishop.} (34. f4 {Prevents the king from reaching e5 and draws easily, for
  // example:} 34... Ra1 35. Bc4 Kc5 36. Kg4 {preparing Kh5 and if Black stops this
  // with} 36... Rh1 {then} 37. a5 $1) 34... Ra1 $1 {A precise move, which for a tactical
  // reason brings Black's king to f4.} (34... Ke5 $2 {is not enough:} 35. Be6 Ra1 36.
  // Kg4 $1 {with a draw.}) 35. Kg2 {Necessary, otherwise the king gets cut after Rg1
  // and the h-pawn decides the game.} (35. Bc4 Rg1 $1 36. a5 h5 37. a6 Kc7 {followed
  // by the advance of the h-pawn.}) (35. Kg3 $2 Rg1+ {wins the bishop.}) 35... Ke5 36.
  // Be6 Kf4 {With the king on f4, Black has a clear winning plan: advance the h-pawn
  // and support it with the king.} 37. Bd7 Rb1 38. Be6 Rb2 39. Bc4 (39. a5 Ra2 40.
  // b4 Ra4 {wins one of the passed pawns.}) 39... Ra2 40. Be6 h5 41. Bd7 {The game
  // was adjourned, but there was no point in continuing. The winning plan is very
  // simple.} (41. Bd7 Kg4 42. Be6 h4 43. Bd7 h3+ 44. Kg1 Ra1+ 45. Kh2 Rf1 {and the
  // f2-pawn is lost.}) 0-1`;
  //
  //     const state = fromPGNString(pgn);
  //     t.same('8/3B4/5p2/5P1p/P4k2/1P6/r4PK1/8 b - - 1 41', state.FEN);
  //     t.has(state, {
  //       event: 'World Championship 28th',
  //       site: 'Reykjavik',
  //       date: '1992.11.04',
  //       round: '21',
  //       white: 'Boris Spassky',
  //       black: 'Fischer, Robert J.',
  //       result: '0-1',
  //     });
  //     t.end();
  //   });
});
