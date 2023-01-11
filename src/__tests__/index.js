const SitemapGenerator = require('../');

describe('#SitemapGenerator', () => {
  let gen, queueItem;

  beforeEach(() => {
    gen = SitemapGenerator('http://foo.bar');
    queueItem = {
      url: 'http://foo.bar',
      depth: 2,
      stateData: {
        headers: {
          'last-modified': 'Thu, 05 Jan 2023 22:12:59 GMT'
        }
      }
    };
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

  test('::parsePage should handle article:modified_time', () => {
    const page =
      '<!doctype html><html class="no-js" lang="en-US"><head><meta property="article:modified_time" content="2021-09-21T15:42:48+00:00" /></head><body>Hello world</body></html>';
    const data = gen.parsePage(queueItem, page, true);

    expect(data.url).toBe(queueItem.url);
    expect(data.lastMod).toBe('2021-09-21T15:42:48+00:00');
    expect(data.formattedLastMod).toBe('2021-09-21');
  });

  test('::parsePage should default to last-modified header', () => {
    const page =
      '<!doctype html><html class="no-js" lang="en-US"><head><meta property="article:published_time" content="2021-09-21T15:42:48+00:00" /></head><body>Hello world</body></html>';
    const data = gen.parsePage(queueItem, page, true);

    expect(data.url).toBe(queueItem.url);
    expect(data.lastMod).toBe(queueItem.stateData.headers['last-modified']);
    expect(data.formattedLastMod).toBe('2023-01-05');
  });
});
