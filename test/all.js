/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;
// test server
var server = require('./lib/server');

// start testserver
test.cb.before(function (t) {
  server.listen(port, localhost, function () {
    t.end();
  });
});

require('./events');
require('./fetching');
require('./general');
require('./options');
require('./parsing');
require('./sitemap');

test.cb.after(function (t) {
  // stop test server
  server.close(function () {
    t.end();
  });
});
