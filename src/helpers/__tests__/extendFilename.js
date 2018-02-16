const extendFilename = require('../extendFilename');

describe('#extendFilename', () => {
  test('should be a function', () => {
    expect(extendFilename).toBeInstanceOf(Function);
  });

  test('should return a string', () => {
    const newFilename = extendFilename('sitemap.xml', '_part1');

    expect(typeof newFilename).toBe('string');
  });

  test('should extend filename with string', () => {
    const newFilename = extendFilename('sitemap.xml', '_part1');

    expect(newFilename).toBe('sitemap_part1.xml');
  });

  test('should extend filenames without extension', () => {
    const newFilename = extendFilename('sitemap', '_part1');

    expect(newFilename).toBe('sitemap_part1');
  });
});
