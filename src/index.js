const fs = require('fs');
const http = require('http');
const path = require('path');
const parseURL = require('url-parse');
const eachSeries = require('async/eachSeries');
const cpFile = require('cp-file');
const normalizeUrl = require('normalize-url');
const mitt = require('mitt');
const format = require('date-fns/format');

const createCrawler = require('./createCrawler');
const SitemapRotator = require('./SitemapRotator');
const createSitemapIndex = require('./createSitemapIndex');
const extendFilename = require('./helpers/extendFilename');
const validChangeFreq = require('./helpers/validChangeFreq');

module.exports = function SitemapGenerator(uri, opts) {
  const defaultOpts = {
    stripQuerystring: true,
    maxEntriesPerFile: 50000,
    maxDepth: 0,
    filepath: path.join(process.cwd(), 'sitemap.xml'),
    userAgent: 'Node/SitemapGenerator',
    respectRobotsTxt: true,
    ignoreInvalidSSL: true,
    timeout: 30000,
    decodeResponses: true,
    lastMod: false,
    changeFreq: '',
    priorityMap: [],
    ignoreAMP: true,
    ignore: null
  };

  if (!uri) {
    throw new Error('Requires a valid URL.');
  }

  const options = Object.assign({}, defaultOpts, opts);

  // if changeFreq option was passed, check to see if the value is valid
  if (opts && opts.changeFreq) {
    options.changeFreq = validChangeFreq(opts.changeFreq);
  }

  const emitter = mitt();

  const parsedUrl = parseURL(
    normalizeUrl(uri, {
      stripWWW: false,
      removeTrailingSlash: false
    })
  );

  // only resolve if sitemap path is truthy (a string preferably)
  const sitemapPath = options.filepath && path.resolve(options.filepath);

  // we don't care about invalid certs
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const crawler = createCrawler(parsedUrl, options);

  // create sitemap stream
  const sitemap = SitemapRotator(
    options.maxEntriesPerFile,
    options.lastMod,
    options.changeFreq,
    options.priorityMap
  );

  const emitError = (code, url) => {
    emitter.emit('error', {
      code,
      message: http.STATUS_CODES[code],
      url
    });
  };

  crawler.on('fetch404', ({ url }) => emitError(404, url));
  crawler.on('fetchtimeout', ({ url }) => emitError(408, url));
  crawler.on('fetch410', ({ url }) => emitError(410, url));
  crawler.on('fetcherror', (queueItem, response) =>
    emitError(response.statusCode, queueItem.url)
  );

  crawler.on('fetchclienterror', (queueError, errorData) => {
    if (errorData.code === 'ENOTFOUND') {
      emitError(404, `Site ${JSON.stringify(queueError)} could not be found. REQUEST: ${JSON.stringify(errorData)}`);
    } else {
      emitError(400, errorData.message);
    }
  });

  crawler.on('fetchdisallowed', ({ url }) => emitter.emit('ignore', url));

  // fetch complete event
  crawler.on('fetchcomplete', (queueItem, page) => {
    const { url, depth } = queueItem;

    if (
      (opts.ignore && opts.ignore(url)) ||
      /(<meta(?=[^>]+noindex).*?>)/.test(page) || // check if robots noindex is present
      (options.ignoreAMP && /<html[^>]+(amp|⚡)[^>]*>/.test(page)) // check if it's an amp page
    ) {
      emitter.emit('ignore', url);
    } else {
      emitter.emit('add', url);

      if (sitemapPath !== null) {
        // eslint-disable-next-line
        const lastMod = queueItem.stateData.headers['last-modified'];
        sitemap.addURL(url, depth, lastMod && format(lastMod, 'YYYY-MM-DD'));
      }
    }
  });

  crawler.on('complete', () => {
    sitemap.finish();

    const sitemaps = sitemap.getPaths();

    const cb = () => emitter.emit('done');

    if (sitemapPath !== null) {
      // move files
      if (sitemaps.length > 1) {
        // multiple sitemaps
        let count = 1;
        eachSeries(
          sitemaps,
          (tmpPath, done) => {
            const newPath = extendFilename(sitemapPath, `_part${count}`);

            // copy and remove tmp file
            cpFile(tmpPath, newPath).then(() => {
              fs.unlink(tmpPath, () => {
                done();
              });
            });

            count += 1;
          },
          () => {
            const filename = path.basename(sitemapPath);
            fs.writeFile(
              sitemapPath,
              createSitemapIndex(
                parsedUrl.toString(),
                filename,
                sitemaps.length
              ),
              cb
            );
          }
        );
      } else if (sitemaps.length) {
        cpFile(sitemaps[0], sitemapPath).then(() => {
          fs.unlink(sitemaps[0], cb);
        });
      } else {
        cb();
      }
    } else {
      cb();
    }
  });

  return {
    start: () => crawler.start(),
    stop: () => crawler.stop(),
    getCrawler: () => crawler,
    getSitemap: () => sitemap,
    queueURL: url => {
      crawler.queueURL(url, undefined, false);
    },
    on: emitter.on,
    off: emitter.off
  };
};
