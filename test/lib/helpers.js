module.exports = {
  buildUrl: function (localhost, port, path) {
    return 'http://' + localhost + ':' + port + path;
  },
};
