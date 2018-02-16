const SitemapGenerator = require('../');

describe('#SitemapGenerator', () => {
  let gen;

  beforeEach(() => {
    gen = SitemapGenerator('http://foo.bar');
  });

  test('should be a function', () => {
    expect(SitemapGenerator).toBeInstanceOf(Function);
  });

  test('should have method start', () => {
    expect(gen).toHaveProperty('start');
  });

  test('should have method stop', () => {
    expect(gen).toHaveProperty('stop');
  });

  test('should have method queueURL', () => {
    expect(gen).toHaveProperty('queueURL');
  });
});
