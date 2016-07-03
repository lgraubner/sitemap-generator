/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;
var buildUrl = require('./lib/helpers').buildUrl;

/**
 * Fetching
 */
test.cb('should ignore excluded file types', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.regex(sitemap, /[^img.jpg]/, 'does not contain img.jpg');
    t.end();
  });

  generator.start();
});

test.cb('should respect "robots.txt" rules', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.ignored.indexOf(buildUrl(localhost, port, '/disallowed')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should ignore pages with "noindex" rule', function (t) {
  t.plan(2);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(localhost, port, '/noindex')), -1);
    t.not(store.ignored.indexOf(buildUrl(localhost, port, '/noindex')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should restrict subsequent requests to given path', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/restricted', {
    port: port,
    restrictToBasepath: true,
  });

  generator.on('done', function (sitemap, store) {
    var containsHome = false;
    store.found.reduce(function (prev, curr) {
      containsHome = new RegExp(buildUrl(localhost, port, '/')).test(curr);
    });

    t.falsy(containsHome);
    t.end();
  });

  generator.start();
});

test.cb('should include query strings if stripQuerystring is "false"', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/querystring', {
    port: port,
    stripQuerystring: false,
  });

  generator.on('done', function (sitemap, store) {
    t.not(store.found.indexOf(buildUrl(localhost, port, '/querystring?foo=bar')), -1);
    t.end();
  });

  generator.start();
});

test.cb('should ignore query strings if stripQuerystring is "true"', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost + '/querystring', {
    port: port,
    stripQuerystring: true,
  });

  generator.on('done', function (sitemap, store) {
    t.is(store.found.indexOf(buildUrl(localhost, port, '/querystring?foo=bar')), -1);
    t.end();
  });

  generator.start();
});
