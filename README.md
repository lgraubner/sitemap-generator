# Sitemap Generator

[![Travis](https://img.shields.io/travis/lgraubner/sitemap-generator.svg)](https://travis-ci.org/lgraubner/sitemap-generator) [![David](https://img.shields.io/david/lgraubner/sitemap-generator.svg)](https://david-dm.org/lgraubner/sitemap-generator) [![npm](https://img.shields.io/npm/v/sitemap-generator.svg)](https://www.npmjs.com/package/sitemap-generator)

> Easily create XML sitemaps for your website.

Generates a sitemap by crawling your site. Uses streams to efficiently write the sitemap to your drive and runs asynchronously to avoid blocking the thread. Is cappable of creating multiple sitemaps if threshold is reached. Respects robots.txt and meta tags.

This package is not meant to be used in a production code base directly, but rather on the deployed product. This means you develop your app/website as usual, deploy it and create the sitemap with this tool _afterwards_. The simplest way is to use the [CLI](https://github.com/lgraubner/sitemap-generator-cli) (this is a different package!) to create the sitemap on the command line. If you have a more advanced usecase or want to adjust the crawler behavior you should use the programmtic version (this package). Create the crawler as needed and simply run it via `node mycrawler.js`.

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Options](#options)
- [Events](#events)
- [FAQ](#faq)
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

### getCrawler()

Returns the crawler instance. For more information about the crawler check the [simplecrawler docs](https://github.com/simplecrawler/simplecrawler#readme).

This can be useful to ignore certain sites and don't add them to the sitemap.

```JavaScript
const crawler = generator.getCrawler();
crawler.addFetchCondition((queueItem, referrerQueueItem, callback) => {
  callback(!queueItem.path.match(/myregex/));
});
```

### queueURL(url)

Add a URL to crawler's queue. Useful to help crawler fetch pages it can't find itself.

## Options

There are a couple of options to adjust the sitemap output. In addition to the options beneath the options of the used crawler can be changed. For a complete list please check it's [official documentation](https://github.com/simplecrawler/simplecrawler#configuration).

```JavaScript
var generator = SitemapGenerator('http://example.com', {
  maxDepth: 0,
  filepath: './sitemap.xml',
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

Filepath for the new sitemap. If multiple sitemaps are created "part\_$index" is appended to each filename. If you don't want to write a file at all you can pass `null` as filepath.

### httpAgent

Type: `HTTPAgent`  
Default: `http.globalAgent`

Controls what HTTP agent to use. This is useful if you want configure HTTP connection through a HTTP/HTTPS proxy (see [http-proxy-agent](https://www.npmjs.com/package/http-proxy-agent)).

### httpsAgent

Type: `HTTPAgent`  
Default: `https.globalAgent`

Controls what HTTPS agent to use. This is useful if you want configure HTTPS connection through a HTTP/HTTPS proxy (see [https-proxy-agent](https://www.npmjs.com/package/https-proxy-agent)).

### ignoreAMP

Type: `boolean`  
Default: `true`

Indicates whether [Google AMP pages](https://www.ampproject.org/) should be ignored and not be added to the sitemap.

### lastMod

Type: `boolean`  
Default: `false`

Whether to add a `<lastmod>` line to each URL in the sitemap. If present the responses `Last-Modified` header will be used. Otherwise todays date is added.

### maxEntriesPerFile

Type: `number`  
Default: `50000`

Google limits the maximum number of URLs in one sitemap to 50000. If this limit is reached the sitemap-generator creates another sitemap. A sitemap index file will be created as well.

### priorityMap

Type: `array`  
Default: `[]`

If provided, adds a `<priority>` line to each URL in the sitemap. Each value in priorityMap array corresponds with the depth of the URL being added. For example, the priority value given to a URL equals `priorityMap[depth - 1]`. If a URL's depth is greater than the length of the priorityMap array, the last value in the array will be used. Valid values are between `1.0` and `0.0`.

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

## FAQ

<details>
<summary>Does this work with React, Angular, ...</summary>
<p>This package don't care what frameworks and technologies you are using under the hood. The only requirement is, that your URL's return valid HTML. Therefore SSR (server side rendering) is required for single page apps as no JavaScript is executed.</p>
</details>

<details>
<summary>Where to put this code</summary>
<p>This is basically up to you. You can execute this code manually and upload your sitemap by hand, or you can put this on your server and run this periodically to keep your sitemap up to date.</p>
</details>

<details>
<summary>Should I use this package or the CLI</summary>
<p>The CLI should suffice most of the common use cases. It has several options to tweak in case you want it to behave differently. If your use case is more advanced and you need fine control about what the crawler should fetch, you should use this package and the programmatic API.</p>
</details>

## License

[MIT](https://github.com/lgraubner/sitemap-generator/blob/master/LICENSE) © [Lars Graubner](https://larsgraubner.com)
