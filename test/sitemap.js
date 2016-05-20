/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;

/**
 * Sitemap
 */
test.cb('should return valid sitemap', function (t) {
  t.plan(4);

  var generator = new SitemapGenerator(localhost, {
    port: port,
  });

  generator.on('done', function (sitemap) {
    // sitemap
    t.regex(sitemap, /^<\?xml version="1.0" encoding="UTF\-8"\?>/, 'has xml header');
    var urlsRegex = /<urlset xmlns=".+?">(.|\n)+<\/urlset>/;
    t.regex(sitemap, urlsRegex, 'has urlset property');
    t.is(sitemap.match(/<url>(.|\n)+?<\/url>/g).length, 2, 'contains url properties');
    t.is(sitemap.match(/<loc>(.|\n)+?<\/loc>/g).length, 2, 'contains loc properties');

    t.end();
  });

  generator.start();
});

test.cb('should return "null" if initital URL not found', function (t) {
  t.plan(1);

  var generator = new SitemapGenerator('invalid');
  generator.on('done', function (sitemap) {
    t.is(sitemap, null, 'returns "null"');
    t.end();
  });
  generator.start();
});
