/* eslint-disable */

module.exports = {
  '/': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="/disallowed">disallowed</a>',
      '<a href="img.jpg">Image</a>',
      '<a href="/single">Single</a>',
      '<a href="/noindex">Noindex</a>',
    ].join('\n'));
    res.end();
  },

  '/relative': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="./">disallowed</a>',
    ].join('\n'));
    res.end();
  },

  '/disallowed': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/special': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="mailto:foo@bar.com">mail</a>',
      '<a href="tel:+12356">telephone</a>',
    ].join('\n'));
    res.end();
  },

  '/single': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/restricted': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="/">Home</a>',
    ].join('\n'));
    res.end();
  },

  '/relative/': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="../">Home</a>',
    ].join('\n'));
    res.end();
  },

  '/relative-2.html': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="../">Home</a>',
    ].join('\n'));
    res.end();
  },

  '/absolute': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="http://127.0.0.1:5173/single">Single</a>',
    ].join('\n'));
    res.end();
  },

  '/base': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<base href="http://127.0.0.1:5173/">',
      '<a href="single">Single</a>',
    ].join('\n'));
    res.end();
  },

  '/base-2': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<base href="/depth/">',
      '<a href="sub">Sub</a>',
    ].join('\n'));
    res.end();
  },

  '/depth/sub': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/protocol': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="//127.0.0.1:5173">Home</a>',
    ].join('\n'));
    res.end();
  },

  '/querystring': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<a href="/querystring?foo=bar">Home</a>',
    ].join('\n'));
    res.end();
  },

  '/querystring?foo=bar': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/robotsmeta': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<meta name="robots" content="index,nofollow">',
      '<a href="/robotsignored">ignored</a>',
    ].join('\n'));
    res.end();
  },

  '/robotsignored': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/noscripts': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<script src="/script"></script>',
    ].join('\n'));
    res.end();
  },

  '/script': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end();
  },

  '/noindex': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write([
      '<meta name="robots" content="noindex,follow">',
    ].join('\n'));
    res.end();
  },

  '/robots.txt': function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('User-agent: *\nDisallow: /disallowed');
    res.end();
  },
};
