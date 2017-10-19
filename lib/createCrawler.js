const Crawler = require('simplecrawler');

const discoverResources = require('./discoverResources');
const stringifyURL = require('./helpers/stringifyURL');

module.exports = (uri, options = {}) => {
  // excluded filetypes
  const exclude = [
    'gif',
    'jpg',
    'jpeg',
    'png',
    'ico',
    'bmp',
    'ogg',
    'webp',
    'mp4',
    'webm',
    'mp3',
    'ttf',
    'woff',
    'json',
    'rss',
    'atom',
    'gz',
    'zip',
    'rar',
    '7z',
    'css',
    'js',
    'gzip',
    'exe',
    'svg',
  ].join('|');

  const extRegex = new RegExp(`\\.(${exclude})$`, 'i');

  const crawler = new Crawler(uri.href);

  // set crawler options
  // see https://github.com/cgiffard/node-simplecrawler#configuration
  crawler.initialPath = uri.pathname !== '' ? uri.pathname : '/';
  crawler.maxDepth = options.crawlerMaxDepth;
  crawler.decodeResponses = true;
  crawler.respectRobotsTxt = true;
  crawler.initialProtocol = uri.protocol.replace(':', '');
  crawler.userAgent = options.userAgent;
  // we don't care about invalid certs
  crawler.ignoreInvalidSSL = true;

  if (options.httpAgent) crawler.httpAgent = options.httpAgent;
  if (options.httpsAgent) crawler.httpsAgent = options.httpsAgent;

  // pass query string handling option to crawler
  crawler.stripQuerystring = options.stripQuerystring;

  if (options.authUser && options.authPass) {
    crawler.needsAuth = true;
    crawler.authUser = options.authUser;
    crawler.authPass = options.authPass;
  }

  // restrict to subpages if path is privided
  crawler.addFetchCondition(parsedUrl => {
    const initialURLRegex = new RegExp(`${uri.pathname}.*`);
    return stringifyURL(parsedUrl).match(initialURLRegex);
  });

  // file type exclusion
  crawler.addFetchCondition(parsedUrl => !parsedUrl.path.match(extRegex));

  // custom discover function
  crawler.discoverResources = discoverResources;

  return crawler;
};
