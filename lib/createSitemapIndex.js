module.exports = (url, filename, sitemapCount) => {
  let sitemapIndex =
    '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (let i = 1; i <= sitemapCount; i += 1) {
    // generate sitemap part url
    const newFilename = filename.replace(
      /(.+?)(\.[a-z0-9]+)?$/i,
      `$1_part${i}$2`
    );
    const sitemapUrl = `${url.replace(/\/$/, '')}/${newFilename}`;
    sitemapIndex += `\n  <sitemap>\n    <loc>${sitemapUrl}</loc>\n  </sitemap>`;
  }
  sitemapIndex += '\n</sitemapindex>';

  return sitemapIndex;
};
