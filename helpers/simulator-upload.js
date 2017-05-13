import { ImagePickerIOS } from 'react-native';
import RNFS from 'react-native-fs';
import uuid from 'uuid/v4';

module.exports = () => {
  const fn = uuid();

  return new Promise((resolve, reject) => {
    ImagePickerIOS.openSelectDialog(
      {},
      imageUri => {
        const tmpFilePath = `${RNFS.TemporaryDirectoryPath}/${fn}.jpg`;

        RNFS.copyAssetsFileIOS(imageUri, tmpFilePath, 1024, 1024).then(() => {
          resolve({
            path: tmpFilePath
          });
        });
      },
      error => {
        console.log(error);
        reject(error);
      }
    );
  });
};
