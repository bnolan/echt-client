import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Common
  container: {
    flex: 1
  },
  header: {
    color: '#dddddd',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'arial rounded mt bold',
    margin: 24,
    marginTop: 48,
    textAlign: 'center'
  },
  dark: {
    color: '#666666'
  },
  text: {
    color: '#dddddd',
    margin: 24
  },
  bigEmoji: {
    fontSize: 48,
    margin: 20,
    height: 60,
    textAlign: 'center'
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    margin: 20,
    color: '#777'
  },
  bold: {
    fontSize: 16,
    color: '#777',
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 0
  },

  // Screens
  welcomeScreen: {
    backgroundColor: '#333333'
  },
  welcomeButton: {
    marginTop: 24,
    alignItems: 'center'
  },
  selfieScreen: {
    backgroundColor: '#333333'
  },
  selfieCamera: {
    width: 320,
    height: 320,
    backgroundColor: '#777777',
    margin: 24,
    borderColor: '#aaaaaa',
    borderWidth: 1,
    borderRadius: 2
  },
  selfieError: {
    color: '#000000',
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  pincodeScreen: {
    backgroundColor: '#333333'
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowRadius: 5,
    shadowOpacity: 0.4
  },
  instructionsScreen: {
    backgroundColor: '#333333'
  },
  instructionsButton: {
    marginTop: 24,
    alignItems: 'center'
  },
  friendScreen: {
    backgroundColor: 'black'
  },
  friendsScreen: {
    padding: 20,
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
    backgroundColor: 'black',
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
    backgroundColor: 'black',
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
