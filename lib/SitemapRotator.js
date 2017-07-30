const SitemapStream = require('./SitemapStream');

module.exports = function SitemapRotator(maxEntries) {
  const sitemaps = [];
  let count = 0;
  let current = null;

  // return temp sitemap paths
  const getPaths = () =>
    sitemaps.reduce((arr, map) => {
      arr.push(map.getPath());
      return arr;
    }, []);

  // adds url to stream
  const add = url => {
    // create stream if none exists
    if (current === null) {
      current = new SitemapStream();
      sitemaps.push(current);
    }

    // rotate stream
    if (count === maxEntries) {
      current.end();
      current = new SitemapStream();
      sitemaps.push(current);
      count = 0;
    }

    current.add(url);

    count += 1;
  };

  // close stream
  const finish = () => {
    if (current) {
      current.end();
    }
  };

  return {
    getPaths,
    add,
    finish,
  };
};
