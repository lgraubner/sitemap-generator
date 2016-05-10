/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;
var buildUrl = require('./lib/helpers').buildUrl;

/**
 * Parsing
 */
/* absolute */
test.cb('should handle absolute links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/absolute', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "//" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/protocol', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/')), -1);
    t.end();
  });

  generator.start();
});

/* relative */
test.cb('should handle "/" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "./" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/relative-2.html', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle "../" links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/relative/', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle absolute base href tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/base', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/single')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should handle relative base href tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/base-2', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/depth/sub')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should respect robots meta tag', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/robotsmeta', {
    port: port,
    restrictToBasepath: true,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(localhost, port, '/robotsignored')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should only parse links', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/noscripts', {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(localhost, port, '/script')), -1);
    t.end();
  });

  generator.start();
});
