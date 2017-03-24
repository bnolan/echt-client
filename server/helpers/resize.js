const promisify = require('es6-promisify');
const childProcess = require('child_process');
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

exports.toInline = (buffer) => {
  const original = tempfile('.jpg');
  const exec = promisify(childProcess.exec);

  fs.writeFileSync(original, buffer);

  const command = `convert ${original} -resize 16x16 -quality 90 -strip -gravity center -crop 16x16+0+0 +repage - | base64`;

  return exec(command).then((stdout, stderr) => {
    return stdout;
  });
};
