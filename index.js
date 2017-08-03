const Generator = require('./lib');

const gen = Generator('https://larsgraubner.com');

gen.on('add', url => {
  console.log('add', url);
});

gen.on('error', err => {
  console.log('error', err);
});

gen.start();
