module.exports = parsed =>
  `${parsed.protocol}://${parsed.host}${parsed.uriPath}`;
