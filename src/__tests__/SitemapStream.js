const SitemapStream = require('../SitemapStream');

describe('#SitemapStream', () => {
  const stream = SitemapStream();

  test('should be a function', () => {
    expect(SitemapStream).toBeInstanceOf(Function);
  });

  describe('#getPath', () => {
    test('should have getPath method', () => {
      expect(stream).toHaveProperty('getPath');
    });

    test('should return path string', () => {
      const path = stream.getPath();
      expect(typeof path).toBe('string');
    });
  });

  describe('#write', () => {
    test('should have write method', () => {
      expect(stream).toHaveProperty('write');
    });
  });

  describe('#end', () => {
    test('should have end method', () => {
      expect(stream).toHaveProperty('end');
    });
  });
});
