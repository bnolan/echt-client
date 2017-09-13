import ImageResizer from 'react-native-image-resizer';

/**
 * Stores a resized image in a temp folder.
 *
 * @param {String} Path to original image
 * @return {Promise}
 */
const toMedium = (path) => {
  return ImageResizer.createResizedImage(
    path,
    640, // width (max, ratio is preserved)
    640, // height (max, ratio is preserved)
    'JPEG',
    90, // quality
    0 // rotation
  );
};

module.exports = {
  toMedium
};
