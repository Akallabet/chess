import test from 'node:test';
import { strict as assert } from 'node:assert';
import { data, myImplementation } from './performances.js';

test('Performance - simple', () => {
  const performance = myImplementation.withFEN(data.simple);
  assert.ok(performance < 10);
});

test('Performance - match of the century', () => {
  const performance = myImplementation.withPGN(data.gameOfTheCentury);
  console.log(performance);
  assert.ok(performance < 90);
});
