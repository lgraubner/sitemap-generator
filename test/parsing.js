/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../lib/SitemapGenerator');
var port = require('./lib/constants').port;
var baseUrl = require('./lib/constants').baseUrl;
var buildUrl = require('./lib/helpers').buildUrl;

/**
 * Parsing
 */
/* absolute */
test.cb('should handle absolute links', function (t) {
  t.plan(1);
  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/absolute'));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "//" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/protocol'));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/')), -1);
    t.end();
  });

  generator.start();
});

/* relative */
test.cb('should handle "/" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, ''));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "./" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/relative-2.html'));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "../" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/relative/'));
  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle absolute base href tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/base'));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle relative base href tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/base-2'));

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/depth/sub')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should respect robots meta tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/robotsmeta'), {
    restrictToBasepath: true,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(baseUrl, port, '/robotsignored')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should only parse links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/noscripts'));

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(baseUrl, port, '/script')), -1);
    t.end();
  });

  generator.start();
});
