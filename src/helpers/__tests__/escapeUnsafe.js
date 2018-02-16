const escapeUnsafe = require('../escapeUnsafe');

describe('#escapeUnsafe', () => {
  test('should be a function', () => {
    expect(escapeUnsafe).toBeInstanceOf(Function);
  });

  test('should escape < characters', () => {
    const url = 'http://test.com/<>&\'"<>&\'"';
    const escapedUrl = escapeUnsafe(url);

    expect(url).toMatch(/</);
    expect(escapedUrl).not.toMatch(/</);
  });

  test('should escape > characters', () => {
    const url = 'http://test.com/<>&\'"<>&\'"';
    const escapedUrl = escapeUnsafe(url);

    expect(url).toMatch(/>/);
    expect(escapedUrl).not.toMatch(/>/);
  });

  test('should escape & characters', () => {
    const url = 'http://test.com/<>&\'"<>&\'"';
    const escapedUrl = escapeUnsafe(url);

    expect(url).toMatch(/&/);
    // Regex with negative lookahead, matches non escaping &'s
    expect(escapedUrl).not.toMatch(/&(?!(?:apos|quot|[gl]t|amp);|#)/);
  });

  test("should escape ' characters", () => {
    const url = 'http://test.com/<>&\'"<>&\'"';
    const escapedUrl = escapeUnsafe(url);

    expect(url).toMatch(/'/);
    expect(escapedUrl).not.toMatch(/'/);
  });

  test('should escape " characters', () => {
    const url = 'http://test.com/<>&\'"<>&\'"';
    const escapedUrl = escapeUnsafe(url);

    expect(url).toMatch(/"/);
    expect(escapedUrl).not.toMatch(/"/);
  });
});
