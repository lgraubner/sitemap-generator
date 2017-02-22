/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../lib/SitemapGenerator');
var baseUrl = require('./lib/constants').baseUrl;
var port = require('./lib/constants').port;
var buildUrl = require('./lib/helpers').buildUrl;

/**
 * Sitemap
 */
test.cb('should return valid sitemap', function (t) {
  t.plan(4);

  var generator = new SitemapGenerator(buildUrl(baseUrl, port, ''));

  generator.on('done', function (sitemap, store) {
    // sitemap
    t.regex(sitemap, /^<\?xml version="1.0" encoding="UTF\-8"\?>/, 'has xml header');
    var urlsRegex = /<urlset xmlns=".+?">(.|\n)+<\/urlset>/;
    t.regex(sitemap, urlsRegex, 'has urlset property');
    t.truthy(sitemap.match(/<url>(.|\n)+?<\/url>/g), 'contains url properties');
    t.truthy(sitemap.match(/<loc>(.|\n)+?<\/loc>/g), 'contains loc properties');

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
