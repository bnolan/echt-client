import { StyleSheet } from 'react-native';

export const colors = {
  textWhite: '#fff',
  textLight: '#ddd',
  textDark: '#666',
  bgDarker: '#000',
  bgLight: '#fff',
  bgMedium: '#777',
  bgDark: '#333'
};

export default StyleSheet.create({
  // Common
  container: {
    flex: 1
  },
  header: {
    color: colors.textLight,
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'arial rounded mt bold',
    margin: 24,
    marginTop: 48,
    textAlign: 'center'
  },
  headerSmall: {
    color: '#666666',
    fontWeight: 'bold',
    fontFamily: 'arial rounded mt bold',
    margin: 12,
    marginBottom: 0
  },
  dark: {
    color: colors.textDark
  },
  text: {
    color: colors.textLight,
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
  selfieCamera: {
    width: 320,
    height: 320,
    backgroundColor: colors.bgMedium,
    margin: 24,
    borderColor: '#aaaaaa',
    borderWidth: 1,
    borderRadius: 2
  },
  selfieError: {
    color: colors.bgDarker,
    lineHeight: 24,
    paddingLeft: 16
  },
  selfieErrorBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 4,
    margin: 30,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    shadowColor: colors.bgDarker,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.4
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

  /* Friend list and friend invitation */
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
    borderColor: '#aaaaaa'
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
