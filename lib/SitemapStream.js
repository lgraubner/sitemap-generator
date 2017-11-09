const path = require('path');
const rand = require('crypto-random-string');
const os = require('os');
const fs = require('fs');
const escapeUnsafe = require('./helpers/escapeUnsafe');

module.exports = function SitemapStream() {
  const tmpPath = path.join(os.tmpdir(), `sitemap_${rand(10)}`);
  const stream = fs.createWriteStream(tmpPath);

  stream.write('<?xml version="1.0" encoding="utf-8" standalone="yes" ?>');
  stream.write(
    '\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  );

  const getPath = () => tmpPath;

  const write = url => {
    const escapedUrl = escapeUnsafe(url);
    stream.write(`\n  <url>\n    <loc>${escapedUrl}</loc>\n  </url>`);
  };

  const end = () => {
    stream.write('\n</urlset>');
    stream.end();
  };

  return {
    getPath,
    write,
    end,
  };
};
