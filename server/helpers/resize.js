const promisify = require('es6-promisify');
const tempfile = require('tempfile');
const im = require('imagemagick');
const fs = require('fs');

exports.toSmall = (buffer) => {
  const original = tempfile('.jpg');
  const small = tempfile('.jpg');
  const crop = promisify(im.crop);

  fs.writeFileSync(original, buffer);

  return crop({
    srcPath: original,
    dstPath: small,
    width: 256,
    height: 256,
    quality: 1
  }).then((stdout, stderr) => {
    return fs.readFileSync(small);
  });
};
