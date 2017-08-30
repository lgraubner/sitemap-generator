const extendFilename = require('../extendFilename');

test('should be a function', () => {
  expect(extendFilename).toBeInstanceOf(Function);
});

test('should extend filename with string', () => {
  const filename = 'sitemap.xml';
  const newFilename = extendFilename(filename, '_part1');

  expect(newFilename).toBe('sitemap_part1.xml');
  expect(typeof newFilename).toBe('string');
});

test('should extend filenames without extension', () => {
  const filename = 'sitemap';
  const newFilename = extendFilename(filename, '_part1');

  expect(newFilename).toBe('sitemap_part1');
  expect(typeof newFilename).toBe('string');
});
