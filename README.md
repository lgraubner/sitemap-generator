# Sitemap Generator

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator.svg)](https://travis-ci.org/lgraubner/sitemap-generator) [![David](https://img.shields.io/david/lgraubner/sitemap-generator.svg)](https://david-dm.org/lgraubner/sitemap-generator) [![David Dev](https://img.shields.io/david/dev/lgraubner/sitemap-generator.svg)](https://david-dm.org/lgraubner/sitemap-generator#info=devDependencies) [![npm](https://img.shields.io/npm/v/sitemap-generator-cli.svg)](https://www.npmjs.com/package/sitemap-generator)

> Easily create XML sitemaps for your website.

## Installation

```BASH
$ npm install -S sitemap-generator
```

## Usage
```JavaScript
var SitemapGenerator = require('sitemap-generator');

// create generator
var generator = new SitemapGenerator('http://example.com');

// register event listeners
generator.on('done', function (sitemaps) {
  console.log(sitemaps); // => array of generated sitemaps
});

// start the crawler
generator.start();
```

The crawler will fetch all folder URL pages and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for each URL to consider if it should be added to the sitemap. Also the crawler will not fetch URL's from a page if the robots meta tag with the value `nofollow` is present and ignore them completely if `noindex` rule is present. The crawler is able to apply the `base` value to found links.

## Options

You can provide some options to alter the behaviour of the crawler.

```JavaScript
var generator = new SitemapGenerator('http://example.com', {
  restrictToBasepath: false,
  stripQuerystring: true,
  maxEntriesPerFile: 50000,
  crawlerMaxDepth: 0,
});
```

Since version 5 port is not an option anymore. If you are using the default ports for http/https your are fine. If you are using a custom port just append it to the URL.

### restrictToBasepath

Type: `boolean`  
Default: `false`

If you specify an URL with a path (e.g. `example.com/foo/`) and this option is set to `true` the crawler will only fetch URL's matching `example.com/foo/*`. Otherwise it could also fetch `example.com` in case a link to this URL is provided.

### stripQueryString

Type: `boolean`  
Default: `true`

Whether to treat URL's with query strings like `http://www.example.com/?foo=bar` as indiviual sites and to add them to the sitemap.

### maxEntriesPerFile

Type: `number`  
Default: `50000`

Google limits the maximum number of URLs in one sitemap to 50000. If this limit is reached the sitemap-generator creates another sitemap. In that case the first entry of the `sitemaps` array is a sitemapindex file.

### crawlerMaxDepth

Type: `number`  
Default: `0`

Defines a maximum distance from the original request at which resources will be fetched.

## Events

The Sitemap Generator emits several events using nodes `EventEmitter`.

### `fetch`

Triggered when the crawler tries to fetch a resource. Passes the status and the url as arguments. The status can be any HTTP status.

```JavaScript
generator.on('fetch', function (status, url) {
  // log url
});
```

### `ignore`

If an URL matches a disallow rule in the `robots.txt` file this event is triggered. The URL will not be added to the sitemap. Passes the ignored url as argument.

```JavaScript
generator.on('ignore', function (url) {
  // log ignored url
});
```

### `clienterror`

Thrown if there was an error on client side while fetching an URL. Passes the crawler error and additional error data as arguments.

```JavaScript
generator.on('clienterror', function (queueError, errorData) {
  // log error
});
```

### `done`

Triggered when the crawler finished and the sitemap is created. Passes the created sitemaps as callback argument. The second argument provides an object containing found URL's, ignored URL's and faulty URL's.

```JavaScript
generator.on('done', function (sitemaps, store) {
  // do something with the sitemaps, e.g. save as file
});
```
