import { StyleSheet } from 'react-native';

// http://www.colourlovers.com/palette/3636765/seapunk_vaporwave
// http://www.colourlovers.com/palette/3887337/Pale_Glitter

export default StyleSheet.create({
  settingsButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4
  },

  // Common
  header: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'arial rounded mt bold',
    margin: 24,
    marginTop: 48,
    textAlign: 'center',
  },
  text: {
    color: '#dddddd',
    margin: 24
  },

  // Screens 
  welcomeScreen: {
    backgroundColor: '#333333',
    flex: 1
  },
  welcomeButton: {
    marginTop: 24,
    alignItems: 'center'
  },

  selfieScreen: {
    backgroundColor: '#333333',
    flex: 1
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
  selfieHeader: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  selfieText: {
    color: '#ffffff',
    margin: 24,
    fontSize: 18
  },
  selfieTextSmall: {
    color: '#eeeeee',
    margin: 24
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
    backgroundColor: '#8795E8',
    flex: 1
  },
  pincodeHeader: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  pincodeText: {
    color: '#ffffff',
    margin: 24,
    fontSize: 18
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
    backgroundColor: '#333333',
    flex: 1
  },
  instructionsText: {
    color: '#dddddd',
    margin: 24,
    marginTop: 0
  },
  instructionsButton: {
    marginTop: 24,
    alignItems: 'center'
  },

});
