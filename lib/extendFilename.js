/* eslint no-bitwise:0 */

module.exports = (fpath, str) => {
  const ext = fpath.slice(((fpath.lastIndexOf('.') - 1) >>> 0) + 2);

  let newFilename;

  if (ext) {
    newFilename = fpath.replace(`.${ext}`, `${str}.${ext}`);
  } else {
    newFilename = `${fpath}${str}`;
  }

  return newFilename;
};
