const game = require('../game');

describe('Game module can be loaded', () => {
  test('game.pieceTest returns whatever is passed', () => {
    expect(game.pieceTest('hello')).toBe('hello');
  });
});
