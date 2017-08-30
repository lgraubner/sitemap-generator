const mitt = require('mitt');

module.exports = function Logger() {
  const emitter = mitt();
  const stats = {};

  const addUp = type => {
    if (stats[type] === undefined) {
      stats[type] = 0;
    }

    stats[type] += 1;
  };

  const log = (type, data) => {
    emitter.emit(type, data);
    addUp(type);
  };

  return {
    on: emitter.on,
    off: emitter.off,
    log,
    stats,
  };
};
