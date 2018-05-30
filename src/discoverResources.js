const url = require('url');
const cheerio = require('cheerio');

module.exports = (buffer, queueItem) => {
  const $ = cheerio.load(buffer.toString('utf8'));

  const metaRobots = $('meta[name="robots"]');

  if (metaRobots.length && /nofollow/i.test(metaRobots.attr('content'))) {
    return [];
  }

  const links = $('a[href]').map(function iteratee() {
    let href = $(this).attr('href');

    // exclude "mailto:" etc
    if (/^[a-z]+:(?!\/\/)/i.test(href)) {
      return null;
    }

    // exclude rel="nofollow" links
    const rel = $(this).attr('rel');
    if (/nofollow/i.test(rel)) {
      return null;
    }

    // remove anchors
    href = href.replace(/(#.*)$/, '');

    // handle "//"
    if (/^\/\//.test(href)) {
      return `${queueItem.protocol}:${href}`;
    }

    // check if link is relative
    // (does not start with "http(s)" or "//")
    if (!/^https?:\/\//.test(href)) {
      const base = $('base').first();
      if (base.length) {
        // base tag is set, prepend it
        if (base.attr('href') !== undefined) {
          // base tags sometimes don't define href, they sometimes they only set target="_top", target="_blank"
          href = url.resolve(base.attr('href'), href);
        }
      }

      // handle links such as "./foo", "../foo", "/foo"
      if (/^\.\.?\/.*/.test(href) || /^\/[^/].*/.test(href)) {
        href = url.resolve(queueItem.url, href);
      }
    }

    return href;
  });

  return links.get();
};
