const SitemapStream = require('./SitemapStream');
const getCurrentDateTime = require('./helpers/getCurrentDateTime');

module.exports = function SitemapRotator(
  maxEntries,
  lastModEnabled,
  changeFreq,
  priorityMap
) {
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
  const addURL = (url, depth, lastMod = getCurrentDateTime()) => {
    const currentDateTime = lastModEnabled ? lastMod : null;

    // exclude existing sitemap.xml
    if (/sitemap\.xml$/.test(url)) {
      return;
    }

    // create stream if none exists
    if (current === null) {
      current = SitemapStream();
      sitemaps.push(current);
    }

    // rotate stream
    if (count === maxEntries) {
      current.end();
      current = SitemapStream();
      sitemaps.push(current);
      count = 0;
    }

    let priority = '';

    // if priorityMap exists, set priority based on depth
    // if depth is greater than map length, use the last value in the priorityMap
    if (priorityMap && priorityMap.length > 0) {
      priority = priorityMap[depth - 1]
        ? priorityMap[depth - 1]
        : priorityMap[priorityMap.length - 1];
    }

    current.write(url, currentDateTime, changeFreq, priority);

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
    addURL,
    finish
  };
};
