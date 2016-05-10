/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;

/**
 * General
 */
test('should throw an error if no url is provided', function (t) {
  t.plan(1);

  function typeError() {
    var generator = new SitemapGenerator();
  }

  t.throws(typeError, TypeError, 'throws TypeError');
});

test('should not start another crawl if currently crawling', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.start();

  t.throws(generator.start, Error, 'throws Error');
});

test('should change status when crawler starts', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  var initialStatus = generator.status;

  generator.start();
  t.not(generator.status, initialStatus, 'status changed');
});
