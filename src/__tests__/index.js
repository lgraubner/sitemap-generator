const SitemapGenerator = require('../index.js');

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

describe('Overriding the location', () => {
  const mockFiles = {};

  jest.doMock('fs', () => {
    (location, contents) => {
      mockFiles[location] = contents;
    };
  });

  test('Overridden locations should be respected', () => {
    SitemapGenerator('https://example.com', {
      overrideLocation: 'https://example.com/sitemaps/'
    });

    expect(Object.keys(mockFiles)).toHaveLength(2);
  });
});
