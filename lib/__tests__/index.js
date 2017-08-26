const SitemapGenerator = require('../');

let gen;

beforeEach(() => {
  gen = SitemapGenerator();
});

test('should be a function', () => {
  expect(SitemapGenerator).toBeInstanceOf(Function);
});

describe('start()', () => {
  test('should have method', () => {
    expect(gen).toHaveProperty('start');
  });
});

describe('stop()', () => {
  test('should have method stop', () => {
    expect(gen).toHaveProperty('stop');
  });
});

describe('getPaths()', () => {
  test('should have method getPaths', () => {
    expect(gen).toHaveProperty('getPaths');
  });

  test('should return array of paths', () => {
    const paths = gen.getPaths();
    expect(Array.isArray(paths)).toBeTruthy();
  });
});

describe('getStats()', () => {
  test('should have method getStats', () => {
    expect(gen).toHaveProperty('getStats');
  });

  test('should return status string', () => {
    const stats = gen.getStats();
    expect(typeof stats).toBe('object');
    expect(stats).toEqual({
      added: 0,
      ignored: 0,
      errored: 0,
    });
  });
});

describe('getStatus()', () => {
  test('should have method getStatus', () => {
    expect(gen).toHaveProperty('getStatus');
  });

  test('should return status string', () => {
    const status = gen.getStatus();
    expect(typeof status).toBe('string');
    expect(status).toBe('waiting');
  });
});
