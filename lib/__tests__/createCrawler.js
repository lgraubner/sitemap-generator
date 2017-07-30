const createCrawler = require('../createCrawler');
const Crawler = require('simplecrawler');
const parse = require('url-parse');

test('should export a function', () => {
  expect(createCrawler).toBeInstanceOf(Function);
});

test('should return crawler instance', () => {
  const crawler = createCrawler(parse('http://example.com'));
  expect(crawler).toBeInstanceOf(Crawler);
});

test('should apply options to crawler', () => {
  const options = {
    crawlerMaxDepth: 2,
  };
  const crawler = createCrawler(parse('http://example.com'), options);
  expect(crawler.maxDepth).toBe(2);
});
