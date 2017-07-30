module.exports = (url, sitemapCount) => {
  let sitemapIndex =
    '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (let i = 1; i <= sitemapCount; i += 1) {
    // generate sitemap part url
    const sitemapUrl = `${url.replace(/\/$/, '')}/sitemap_part${i}.xml`;
    sitemapIndex += `\n  <sitemap>\n    <loc>${sitemapUrl}</loc>\n  </sitemap>`;
  }
  sitemapIndex += '\n</sitemapindex>';

  return sitemapIndex;
};
