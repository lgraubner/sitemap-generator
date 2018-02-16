const stringifyURL = require('../stringifyURL');

describe('#stringifyURL', () => {
  const url = {
    protocol: 'http',
    host: 'example.com',
    uriPath: '/test',
  };

  test('should be a function', () => {
    expect(stringifyURL).toBeInstanceOf(Function);
  });

  test('should return a string', () => {
    const str = stringifyURL(url);

    expect(typeof str).toBe('string');
  });

  test('should create valid URL string', () => {
    const str = stringifyURL(url);

    expect(str).toBe('http://example.com/test');
  });
});
