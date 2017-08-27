const fs = require('fs');
const http = require('http');
const path = require('path');
const mitt = require('mitt');
const parseURL = require('url-parse');
const each = require('async/each');
const cpFile = require('cp-file');

const createCrawler = require('./createCrawler');
const SitemapRotator = require('./SitemapRotator');
const createSitemapIndex = require('./createSitemapIndex');
const extendFilename = require('./extendFilename');

module.exports = function SitemapGenerator(uri, opts) {
  const defaultOpts = {
    stripQuerystring: true,
    maxEntriesPerFile: 50000,
    crawlerMaxDepth: 0,
    filepath: path.join(process.cwd(), 'sitemap.xml'),
    userAgent: 'Node/SitemapGenerator',
  };

  const options = Object.assign({}, defaultOpts, opts);

  let status = 'waiting';
  let added = 0;
  let ignored = 0;
  let errored = 0;

  const setStatus = newStatus => {
    status = newStatus;
  };

  const getStatus = () => status;

  const getStats = () => ({ added, ignored, errored });

  const paths = [];

  const getPaths = () => paths;

  const parsedUrl = parseURL(uri);
  const sitemapPath = path.resolve(options.filepath);

  if (parsedUrl.protocol === '') {
    throw new TypeError('Invalid URL.');
  }

  const emitter = mitt();
  const crawler = createCrawler(parsedUrl, options);

  const start = () => {
    setStatus('started');
    crawler.start();
  };

  const stop = () => {
    setStatus('stopped');
    crawler.stop();
  };

  // create sitemap stream
  const sitemap = SitemapRotator(options.maxEntriesPerFile);

  const emitError = (event, code, url) => {
    errored += 1;
    emitter.emit(event, {
      code,
      message: http.STATUS_CODES[code],
      url,
    });
  };

  const emitIgnore = url => {
    ignored += 1;
    emitter.emit('ignore', url);
  };

  const emitAdd = url => {
    added += 1;
    emitter.emit('add', url);
    sitemap.addURL(url);
  };

  crawler.on('fetch404', queueItem => emitError('error', 404, queueItem.url));
  crawler.on('fetchtimeout', queueItem =>
    emitError('error', 408, queueItem.url)
  );
  crawler.on('fetch410', queueItem => emitError('error', 410, queueItem.url));
  crawler.on('fetcherror', (queueItem, response) =>
    emitError('error', response.statusCode, queueItem.url)
  );

  crawler.on('fetchclienterror', (queueError, errorData) => {
    let message;

    if (errorData.code === 'ENOTFOUND') {
      message = `Site "${parsedUrl.href}" could not be found.`;
    } else {
      message = 'An unknown error occured.';
    }

    throw new Error(message);
  });

  crawler.on('fetchdisallowed', emitIgnore);

  // fetch complete event
  crawler.on('fetchcomplete', (queueItem, page) => {
    // check if robots noindex is present
    if (/<meta(?=[^>]+noindex).*?>/.test(page)) {
      emitIgnore(queueItem.url);
    } else {
      emitAdd(queueItem.url);
    }
  });

  crawler.on('complete', () => {
    sitemap.finish();

    const sitemaps = sitemap.getPaths();

    const cb = () => {
      setStatus('done');
      emitter.emit('done', getStats());
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
      cpFile(sitemaps[0], sitemapPath, () => {
        fs.unlink(sitemaps[0], cb);
      });
    }
  });

  return Object.assign({}, emitter, {
    getPaths,
    getStats,
    getStatus,
    start,
    stop,
  });
};
