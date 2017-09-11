import { StyleSheet } from 'react-native';

export const colors = {
  textWhite: '#fff',
  textLight: '#ddd',
  textDark: '#666',
  bgDarker: '#000',
  bgLight: '#fff',
  bgMedium: '#777',
  bgDark: '#333',
  bgPink: '#ff00aa'
};

export default {
  container: {
    backgroundColor: '#FFF'
  },
  text: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    fontFamily: 'System'
  },
  flex0: {
    flex: 0
  },
  mb: {
    marginBottom: 5
  },
  mb10: {
    marginBottom: 10
  },
  mb15: {
    marginBottom: 15
  },
  ml5: {
    marginLeft: 5
  },
  mr5: {
    marginRight: 5
  },
  margin10: {
    margin: 10
  },
  margin15: {
    margin: 15
  }
};

/*
export default StyleSheet.create({
  // Common
  container: {
    backgroundColor: colors.bgLight
  },
  header: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'helvetica neue',
    margin: 24,
    marginTop: 48,
    textAlign: 'center'
  },
  headerSmall: {
    color: '#666666',
    fontWeight: 'bold',
    fontFamily: 'helvetica neue',
    margin: 12,
    marginBottom: 0
  },
  headerView: {
    backgroundColor: '#ff00aa',
    padding: 12,
    flexDirection: 'row',
    shadowColor: colors.bgDark,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.2
  },
  dark: {
    color: colors.textDark
  },
  text: {
    color: colors.textWhite,
    margin: 24
  },
  bigEmoji: {
    fontSize: 48,
    margin: 20,
    height: 60,
    textAlign: 'center'
  },
  paragraph: {
    color: colors.textLight,
    fontSize: 16,
    lineHeight: 24,
    margin: 20
  },
  viewCentered: {
    alignItems: 'center'
  },

  // Screens
  welcomeScreen: {
    backgroundColor: colors.bgDark
  },
  welcomeButton: {
    marginTop: 24,
    width: 240
  },
  selfieScreen: {
    backgroundColor: colors.bgDark
  },
  // Work with absolute positioning because RNCamera doesn't allow nesting,
  // see https://github.com/lwansbrough/react-native-camera/issues/591
  selfieCameraContainer: {
    width: 320,
    height: 320,
    backgroundColor: colors.bgMedium,
    margin: 24,
    borderColor: '#aaaaaa',
    borderWidth: 1,
    borderRadius: 2
  },
  selfieCamera: {
    flex: 1,
    position: 'relative',
    zIndex: 100
  },
  selfiePreview: {
    margin: 24
  },
  selfiePreviewImage: {
    width: 320,
    height: 320,
    borderColor: '#aaaaaa',
    borderWidth: 1,
    borderRadius: 2
  },
  selfiePreviewActivityIndicator: {
    position: 'absolute',
    width: 320,
    height: 320
  },
  selfiePreviewButtons: {
    flex: 1,
    flexDirection: 'row'
  },
  selfieUploading: {
    backgroundColor: 'white',
    flex: 1,
    margin: 0,
    padding: 0,
    flexDirection: 'column'
  },
  selfieUploadingText: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 8,
    padding: 0,
    margin: 0,
    color: '#555555'
  },
  selfiePreviewButton: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0
  },
  selfieError: {
    color: colors.bgDarker,
    lineHeight: 24,
    paddingLeft: 8
  },
  selfieErrorBox: {
    backgroundColor: 'white',
    padding: 4,
    flexDirection: 'row',
    marginRight: 2
  },
  pincodeScreen: {
    backgroundColor: colors.bgDark
  },
  pinView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  pinTextInput: {
    backgroundColor: '#F0F0F0',
    textAlign: 'center',
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    height: 50,
    width: 40,
    borderRadius: 5,
    shadowColor: colors.bgDark,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  instructionsScreen: {
    backgroundColor: colors.bgDark
  },
  instructionsButton: {
    marginTop: 24,
    alignItems: 'center'
  },

  friendScreen: {
    backgroundColor: colors.bgDarker
  },
  friendsScreen: {
    padding: 20,
    backgroundColor: 'white'
  },
  friendItem: {
    flexDirection: 'row',
    height: 128,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.4,
    borderWidth: 1,
    borderColor: '#aaaaaa',
    marginBottom: 0
  },
  friendItemDetail: {
    flex: 0.7,
    flexDirection: 'column'
  },
  friendItemText: {
    margin: 12,
    marginBottom: 0
  },
  friendButtons: {
    flexDirection: 'row',
    marginTop: 8,
    marginBottom: 8
  },
  friendButton: {
    margin: 0,
    padding: 8,
    borderRadius: 2
  },
  noFriends: {
    padding: 20,
    flex: 1,
    backgroundColor: 'white'
  },

  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoActionsTop: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingRight: 20,
    backgroundColor: colors.bgDarker,
    opacity: 0.7
  },
  photoActionsBottom: {
    flex: 1,
    alignItems: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingRight: 20,
    backgroundColor: colors.bgDarker,
    opacity: 0.7
  },
  photoIcon: {
    color: 'white'
  },
  settingsScreen: {
    alignItems: 'center'
  },
  settingsActionContainer: {
    width: 220,
    marginTop: 20
  }
});
*/