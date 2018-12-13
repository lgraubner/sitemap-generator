const cheerio = require('cheerio');

const mockFiles = {};

jest.mock('cp-file', () => (source, destination, options) => {
  if (['1.xml', '2.xml'].includes(source)) {
    return Promise.resolve();
  } else {
    return require.requireActual('cp-file')(source, destination, options);
  }
});

jest.mock('fs', () => {
  const realFs = require.requireActual('fs');
  return Object.assign({}, realFs, {
    writeFile: (location, contents) => {
      mockFiles[location] = contents;
    },
    readFile: (location, options, cb) => {
      if (['1.xml', '2.xml'].includes(location)) {
        cb(null, '<mockXml/>');
      } else {
        realFs.readFile(location, options, cb);
      }
    },
    stat: (filename, cb) => {
      if (['1.xml', '2.xml'].includes(filename)) {
        cb(null, {});
      } else {
        realFs.stat(filename, cb);
      }
    }
  });
});

jest.mock('../SitemapRotator.js', () => () => ({
  getPaths: () => ['1.xml', '2.xml'],
  finish: () => undefined
}));

jest.mock('../createCrawler.js', () => {
  const mockCrawler = () => ({
    start: () => {},
    on: (eventName, cb) => {
      if (eventName === 'complete') {
        cb();
      }
    }
  });

  return mockCrawler;
});

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
  test('Overridden locations should be respected', done => {
    expect.assertions(1);

    const sitemapFilepath = `${__dirname}/fixtures/sitemap.xml`;

    SitemapGenerator('https://www.example.com', {
      maxEntriesPerFile: 1,
      locationOverride: 'https://example.com/sitemaps/',
      filepath: sitemapFilepath,
      maxDepth: 0
    });

    setTimeout(() => {
      const $ = cheerio.load(mockFiles[sitemapFilepath]);

      const locations = $('loc')
        .get()
        .map(c => cheerio(c).text());

      expect(locations).toEqual([
        `https://example.com/sitemaps/sitemap_part1.xml`,
        `https://example.com/sitemaps/sitemap_part2.xml`
      ]);

      done();
    }, 500);
  });
});
