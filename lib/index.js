const fs = require('fs');
const http = require('http');
const path = require('path');
const mitt = require('mitt');
const parseURL = require('url-parse');
const each = require('async/each');

const createCrawler = require('./createCrawler');
const SitemapRotator = require('./SitemapRotator');
const createSitemapIndex = require('./createSitemapIndex');

module.exports = function SitemapGenerator(uri, opts) {
  const defaultOpts = {
    stripQuerystring: true,
    maxEntriesPerFile: 50000,
    crawlerMaxDepth: 0,
    filepath: path.join(process.cwd(), 'sitemap.xml'),
  };

  const options = Object.assign({}, defaultOpts, opts);

  let status = 'waiting';

  const parsedUrl = parseURL(uri);

  if (parsedUrl.protocol === '') {
    throw new TypeError('Invalid url.');
  }

  const emitter = mitt();
  const crawler = createCrawler(parsedUrl, options);

  // create sitemap stream
  const sitemap = new SitemapRotator(options.maxEntriesPerFile);

  const log = (event, code, url) => {
    emitter.emit(event, {
      code,
      message: http.STATUS_CODES[code],
      url,
    });
  };

  crawler.on('fetch404', queueItem => log('error', 404, queueItem.url));
  crawler.on('fetchtimeout', queueItem => log('error', 408, queueItem.url));
  crawler.on('fetch410', queueItem => log('error', 410, queueItem.url));
  crawler.on('fetcherror', (queueItem, response) =>
    log('error', response.statusCode, queueItem.url)
  );

  crawler.on('fetchclienterror', (queueError, errorData) => {
    // eslint-disable-next-line
    console.error(queueError, errorData);
  });

  crawler.on('fetchdisallowed', queueItem => {
    emitter.emit('ignore', queueItem.url);
  });

  // fetch complete event
  crawler.on('fetchcomplete', (queueItem, page) => {
    // check if robots noindex is present
    if (/<meta(?=[^>]+noindex).*?>/.test(page)) {
      emitter.emit('ignore', queueItem.url);
    } else {
      emitter.emit('add', queueItem.url);
      sitemap.add(queueItem.url);
    }
  });

  crawler.on('complete', () => {
    sitemap.finish();

    const sitemaps = sitemap.getPaths();

    const cb = () => {
      status = 'done';
      emitter.emit('done');
    };

    // move files
    if (sitemaps.length > 1) {
      // multiple sitemaps
      let count = 1;
      each(
        sitemaps,
        (tmpPath, done) => {
          const newPath = options.filepath.replace(
            /(.+?)((\.[0-9a-z]+)?)$/i,
            `$1_part${count}$2`
          );

          fs.rename(tmpPath, newPath, () => {
            done();
          });
          count += 1;
        },
        () => {
          const filename = options.filepath.replace(/.+\/([^/]+)$/i, '$1');
          fs.writeFile(
            options.filepath,
            createSitemapIndex(parsedUrl.toString(), filename, sitemaps.length),
            cb
          );
        }
      );
    } else if (sitemaps.length) {
      fs.rename(sitemaps[0], options.filepath, cb);
    }
  });

  const start = () => {
    status = 'started';
    crawler.start();
  };

  const stop = () => {
    status = 'stopped';
    crawler.stop();
  };

  const getStatus = () => status;

  return Object.assign({}, emitter, { start, stop, getStatus });
};
