const SitemapGenerator = require('./lib');

const gen = SitemapGenerator('https://larsgraubner.com');

gen.on('ignore', data => {
  console.log('ignore', data);
});

gen.on('add', data => {
  console.log('add', data);
});

gen.on('error', data => {
  console.log('error', data);
});

gen.on('done', data => {
  console.log('done', data);
});

gen.start();
