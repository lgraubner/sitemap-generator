/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var isObject = require('lodash.isobject');
var localhost = require('./lib/constants').localhost;

/**
 * Events
 */
test.cb('fetch event should provide statusCode and fetched url', function (t) {
  t.plan(4);

  var generator = new SitemapGenerator(localhost + '/single');

  generator.on('fetch', function (status, url) {
    t.is(typeof status, 'string', 'status is a string');
    t.regex(status, /(NOT FOUND|OK)/, 'is a valid status');

    t.is(typeof url, 'string', 'url is a string');
    t.regex(url, /^https?:\/\//, 'is a valid url');

    t.end();
  });

  generator.start();
});

test.cb('ignore event should provide ignored url', function (t) {
  t.plan(2);

  var generator = new SitemapGenerator(localhost);

  generator.on('ignore', function (url) {
    t.is(typeof url, 'string', 'url is a string');
    t.regex(url, /^https?:\/\//, 'is a valid url');

    t.end();
  });

  generator.start();
});

test.cb('done event should provide generated sitemap and url store', function (t) {
  t.plan(2);

  var generator = new SitemapGenerator(localhost);

  generator.on('done', function (sitemap, store) {
    // sitemap
    t.is(typeof sitemap, 'string', 'returns xml string');

    // store
    t.truthy(isObject(store), 'returns object');
    t.end();
  });

  generator.start();
});
