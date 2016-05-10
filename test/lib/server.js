/**
 * Simple testserver.
 */
var http = require('http');
var routes = require('./routes');

this.server = http.createServer(function (req, res) {
  if (routes[req.url] && typeof routes[req.url] === 'function') {
    routes[req.url](req, res);
  } else {
    res.writeHead(404, http.STATUS_CODES[404]);
    res.write('Page not found.');
    res.end();
  }
});

exports.listen = function () {
  this.server.listen.apply(this.server, arguments);
};

exports.close = function (callback) {
  this.server.close(callback);
};
