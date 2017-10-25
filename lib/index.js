const fs = require('fs');
const http = require('http');
const path = require('path');
const parseURL = require('url-parse');
const each = require('async/each');
const cpFile = require('cp-file');

const createCrawler = require('./createCrawler');
const SitemapRotator = require('./SitemapRotator');
const createSitemapIndex = require('./createSitemapIndex');
const extendFilename = require('./helpers/extendFilename');
const Logger = require('./Logger');

module.exports = function SitemapGenerator(uri, opts) {
  const defaultOpts = {
    stripQuerystring: true,
    maxEntriesPerFile: 50000,
    crawlerMaxDepth: 0,
    filepath: path.join(process.cwd(), 'sitemap.xml'),
    userAgent: 'Node/SitemapGenerator',
  };

  const options = Object.assign({}, defaultOpts, opts);

  const { log, on, off, stats } = Logger();

  let status = 'waiting';

  const setStatus = newStatus => {
    status = newStatus;
  };

  const getStatus = () => status;

  const getStats = () => ({
    added: stats.add || 0,
    ignored: stats.ignore || 0,
    errored: stats.error || 0,
  });

  const paths = [];

  const getPaths = () => paths;

  const parsedUrl = parseURL(uri);
  const sitemapPath = path.resolve(options.filepath);

  if (parsedUrl.protocol === '') {
    throw new TypeError('Invalid URL.');
  }

  // we don't care about invalid certs
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const crawler = createCrawler(parsedUrl, options);

  const start = () => {
    setStatus('started');
    crawler.start();
  };

  const stop = () => {
    setStatus('stopped');
    crawler.stop();
  };

  const queueURL = url => {
    crawler.queueURL(url, undefined, false);
  };

  // create sitemap stream
  const sitemap = SitemapRotator(options.maxEntriesPerFile);

  const logError = (code, url) => {
    log('error', {
      code,
      message: http.STATUS_CODES[code],
      url,
    });
  };

  crawler.on('fetch404', ({ url }) => logError(404, url));
  crawler.on('fetchtimeout', ({ url }) => logError(408, url));
  crawler.on('fetch410', ({ url }) => logError(410, url));
  crawler.on('fetcherror', (queueItem, response) =>
    logError(response.statusCode, queueItem.url)
  );

  crawler.on('fetchclienterror', (queueError, errorData) => {
    if (errorData.code === 'ENOTFOUND') {
      throw new Error(`Site "${parsedUrl.href}" could not be found.`);
    } else {
      logError(400, errorData.message);
    }
  });

  crawler.on('fetchdisallowed', ({ url }) => log('ignore', url));

  // fetch complete event
  crawler.on('fetchcomplete', (queueItem, page) => {
    const { url } = queueItem;
    // check if robots noindex is present
    if (/<meta(?=[^>]+noindex).*?>/.test(page)) {
      log('ignore', url);
    } else {
      log('add', url);
      sitemap.addURL(url);
    }
  });

  crawler.on('complete', () => {
    sitemap.finish();

    const sitemaps = sitemap.getPaths();

    const cb = () => {
      setStatus('done');
      log('done', getStats());
    };

    // move files
    if (sitemaps.length > 1) {
      // multiple sitemaps
      let count = 1;
      each(
        sitemaps,
        (tmpPath, done) => {
          const newPath = extendFilename(sitemapPath, `_part${count}`);
          paths.push(newPath);

          // copy and remove tmp file
          cpFile(tmpPath, newPath).then(() => {
            fs.unlink(tmpPath, () => {
              done();
            });
          });

          count += 1;
        },
        () => {
          paths.unshift(sitemapPath);
          const filename = path.basename(sitemapPath);
          fs.writeFile(
            sitemapPath,
            createSitemapIndex(parsedUrl.toString(), filename, sitemaps.length),
            cb
          );
        }
      );
    } else if (sitemaps.length) {
      paths.unshift(sitemapPath);
      cpFile(sitemaps[0], sitemapPath).then(() => {
        fs.unlink(sitemaps[0], cb);
      });
    } else {
      cb();
    }
  });

  return {
    getPaths,
    getStats,
    getStatus,
    start,
    stop,
    queueURL,
    on,
    off,
  };
};
