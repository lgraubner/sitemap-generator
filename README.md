# Sitemap Generator

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator.svg)](https://travis-ci.org/lgraubner/sitemap-generator) [![David](https://img.shields.io/david/lgraubner/sitemap-generator.svg)](https://david-dm.org/lgraubner/sitemap-generator) [![npm](https://img.shields.io/npm/v/sitemap-generator.svg)](https://www.npmjs.com/package/sitemap-generator)

> Easily create XML sitemaps for your website.

Generates a sitemap by crawling your site. Uses streams to efficiently write the sitemap to your drive and runs asynchronously to avoid blocking the thread. Is cappable of creating multiple sitemaps if threshold is reached. Respects robots.txt and meta tags.

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Options](#options)
- [Events](#events)
- [License](#license)

## Install

This module is available on [npm](https://www.npmjs.com/).

```
$ npm install -S sitemap-generator
```

This module is running only with Node.js and is not meant to be used in the browser.

## Usage

```JavaScript
const SitemapGenerator = require('sitemap-generator');

// create generator
const generator = SitemapGenerator('http://example.com', {
  stripQuerystring: false
});

// register event listeners
generator.on('done', () => {
  // sitemaps created
});

// start the crawler
generator.start();
```

The crawler will fetch all folder URL pages and file types [parsed by Google](https://support.google.com/webmasters/answer/35287?hl=en). If present the `robots.txt` will be taken into account and possible rules are applied for each URL to consider if it should be added to the sitemap. Also the crawler will not fetch URL's from a page if the robots meta tag with the value `nofollow` is present and ignore them completely if `noindex` rule is present. The crawler is able to apply the `base` value to found links.

## API

The generator offers straightforward methods to start and stop it. You can also add URL's manually.

### start()

Starts crawler asynchronously and writes sitemap to disk.

### stop()

Stops the running crawler and halts the sitemap generation.

### queueURL(url)

Add a URL to crawler's queue. Useful to help crawler fetch pages it can't find itself.

## Options

There are a couple of options to adjust the sitemap output. In addition to the options beneath the options of the used crawler can be changed. For a complete list please check it's [official documentation](https://github.com/simplecrawler/simplecrawler#configuration).

```JavaScript
var generator = SitemapGenerator('http://example.com', {
  maxDepth: 0,
  filepath: path.join(process.cwd(), 'sitemap.xml'),
  maxEntriesPerFile: 50000,
  stripQuerystring: true
});
```

### changeFreq

Type: `string`  
Default: `undefined`

If defined, adds a `<changefreq>` line to each URL in the sitemap. Possible values are `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`. All other values are ignored.

### filepath

Type: `string`  
Default: `./sitemap.xml`

Filepath for the new sitemap. If multiple sitemaps are created "part_$index" is appended to each filename.

### httpAgent

Type: `HTTPAgent`  
Default: `http.globalAgent`

Controls what HTTP agent to use. This is useful if you want configure HTTP connection through a HTTP/HTTPS proxy (see [http-proxy-agent](https://www.npmjs.com/package/http-proxy-agent)).

### httpsAgent

Type: `HTTPAgent`  
Default: `https.globalAgent`

Controls what HTTPS agent to use. This is useful if you want configure HTTPS connection through a HTTP/HTTPS proxy (see [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent)).

### lastMod

Type: `boolean`  
Default: `false`

Whether to add a `<lastmod>` line to each URL in the sitemap, and fill it with today's date.

### maxEntriesPerFile

Type: `number`  
Default: `50000`

Google limits the maximum number of URLs in one sitemap to 50000. If this limit is reached the sitemap-generator creates another sitemap. A sitemap index file will be created as well.

### priorityMap

Type: `array`  
Default: `[]`

If provided, adds a `<priority>` line to each URL in the sitemap. Each value in priorityMap array corresponds with the depth of the URL being added. For example, the priority value given to a URL equals `priorityMap[depth - 1]`. If a URL's depth is greater than the length of the priorityMap array, the last value in the array will be used. Valid values are between `1.0` and `0.0`.

### auth

Type: `string`  
Default: undefined

If provided, adds a basic Http authentication. Must be provided in the following format: `user:pass`.

## Events

The Sitemap Generator emits several events which can be listened to.

### `add`

Triggered when the crawler successfully added a resource to the sitemap. Passes the url as argument.

```JavaScript
generator.on('add', (url) => {
  // log url
});
```

### `done`

Triggered when the crawler finished and the sitemap is created.

```JavaScript
generator.on('done', () => {
  // sitemaps created
});
```

### `error`

Thrown if there was an error while fetching an URL. Passes an object with the http status code, a message and the url as argument.

```JavaScript
generator.on('error', (error) => {
  console.log(error);
  // => { code: 404, message: 'Not found.', url: 'http://example.com/foo' }
});
```

### `ignore`

If an URL matches a disallow rule in the `robots.txt` file or meta robots noindex is present this event is triggered. The URL will not be added to the sitemap. Passes the ignored url as argument.

```JavaScript
generator.on('ignore', (url) => {
  // log ignored url
});
```

## License

[MIT](https://github.com/lgraubner/sitemap-generator/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
