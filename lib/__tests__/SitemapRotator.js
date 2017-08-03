const SitemapRotator = require('../SitemapRotator');

const rotator = SitemapRotator(2000);
rotator.addURL('http://atest.com');

afterAll(() => {
  rotator.finish();
});

test('should be a function', () => {
  expect(SitemapRotator).toBeInstanceOf(Function);
});

describe('#addURL', () => {
  test('should have addURL method', () => {
    expect(rotator).toHaveProperty('addURL');
  });
});

describe('#getPaths', () => {
  test('should have getPaths method', () => {
    expect(rotator).toHaveProperty('getPaths');
  });

  test('should return array of paths', () => {
    const paths = rotator.getPaths();
    const expected = [expect.stringMatching(/.+/)];
    expect(paths).toEqual(expect.arrayContaining(expected));
  });
});

describe('#finish', () => {
  test('should have finish method', () => {
    expect(rotator).toHaveProperty('finish');
  });
});
