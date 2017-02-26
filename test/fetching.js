/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../lib/SitemapGenerator');
var baseUrl = require('./lib/constants').baseUrl;
var buildUrl = require('./lib/helpers').buildUrl;
var port = require('./lib/constants').port;

/**
 * Fetching
 */
test.cb('should ignore excluded file types', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, ''));

  generator.on('done', function (sitemaps, store) {
    t.regex(sitemaps[0], /[^img.jpg]/, 'does not contain img.jpg');
    t.end();
  });

  generator.start();
});

test.cb('should respect "robots.txt" rules', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, ''));

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(baseUrl, port, '/disallowed')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should ignore pages with "noindex" rule', function (t) {
  t.plan(2);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, ''));

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(baseUrl, port, '/noindex')), -1);
    t.not(store.ignored.indexOf(buildUrl(baseUrl, port, '/noindex')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should restrict subsequent requests to given path', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/restricted'), {
    restrictToBasepath: true,
  });

  generator.on('done', function (sitemap, store) {
    var containsHome = false;
    store.found.reduce(function (prev, curr) {
      containsHome = new RegExp(buildUrl(baseUrl, port, '/')).test(curr);
    });

    t.falsy(containsHome);
    t.end();
  });

  generator.start();
});

test.cb('should include query strings if stripQuerystring is "false"', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/querystring'), {
    stripQuerystring: false,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(baseUrl, port, '/querystring?foo=bar')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should ignore query strings if stripQuerystring is "true"', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, '/querystring'), {
    port: port,
    stripQuerystring: true,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(baseUrl, port, '/querystring?foo=bar')), -1);
    t.end();
  });

  generator.start();
});
