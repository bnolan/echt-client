import { StyleSheet } from 'react-native';

// http://www.colourlovers.com/palette/3636765/seapunk_vaporwave
// http://www.colourlovers.com/palette/3887337/Pale_Glitter

export default StyleSheet.create({
  settingsButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 4
  },

  // Pink and white
  welcomeScreen: {
    backgroundColor: '#333333',
    flex: 1
  },
  welcomeHeader: {
    color: '#00aaff',
    fontSize: 48,
    fontWeight: 'bold',
    margin: 24,
    marginTop: 48,
    textAlign: 'center',
    fontFamily: 'arial rounded mt bold'
  },
  welcomeText: {
    color: '#eeeeee',
    margin: 24
  },
  welcomeButton: {
    marginTop: 24,
    alignItems: 'center'
  },

  selfieScreen: {
    backgroundColor: '#8795E8',
    flex: 1
  },
  selfieCamera: {
    width: 320,
    height: 320,
    backgroundColor: '#777777',
    margin: 24,
    borderColor: '#ff00aa',
    borderWidth: 1
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
    color: '#ff00aa',
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

  instructionView: {
    backgroundColor: '#32006C',
    flex: 1
  },
  instructionHeader: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 24
  },
  instructionText: {
    color: '#FFFFFF',
    margin: 24,
    marginBottom: 24,
    marginTop: 0,
    fontSize: 16
  },
  instructionButton: {

  }

});
