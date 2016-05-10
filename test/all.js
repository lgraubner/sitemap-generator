/* eslint no-unused-vars:0 */
var test = require('ava');
var SitemapGenerator = require('../SitemapGenerator');
var port = require('./lib/constants').port;
var localhost = require('./lib/constants').localhost;
// test server
var server = require('./lib/server');

// start testserver
test.before(function () {
  server.listen(port, localhost);
});

require('./events');
require('./fetching');
require('./general');
require('./options');
require('./parsing');
require('./sitemap');

test.after(function () {
  // stop test server
  server.close();
});
