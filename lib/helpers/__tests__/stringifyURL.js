const stringifyURL = require('../stringifyURL');

test('should be a function', () => {
  expect(stringifyURL).toBeInstanceOf(Function);
});

test('should create URL string', () => {
  const url = {
    protocol: 'http',
    host: 'example.com',
    uriPath: '/test',
  };
  const str = stringifyURL(url);

  expect(typeof str).toBe('string');
  expect(str).toBe('http://example.com/test');
});
