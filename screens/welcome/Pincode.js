import React from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';

export default class PincodeScreen extends React.Component {
  constructor () {
    super();

    this.state = {
      complete: false,
      focussed: 0,
      code: []
    };

    this.textInputsRefs = [];
  }

  focus (id) {
    this.textInputsRefs[id].focus();
  }

  handleEdit (text, id) {
    var code = this.state.code;
    var focussed = this.state.focussed + 1;

    code[this.state.focussed] = text;

    this.setState({
      code: code,
      focussed: focussed
    });

    console.log(code);

    if (focussed >= 4) {
      this.textInputsRefs[3].blur();
    } else {
      this.focus(focussed);
    }

    if (Object.keys(this.state.code).length === 4) {
      this.setState({
        complete: true
      });
    }
  }

  setInputRef (id, ref) {
    this.textInputsRefs[id] = ref;
  }

  render () {
    const { navigation: { navigate } } = this.props;
    const pins = [];

    for (let id = 0; id < 4; id++) {
      pins.push(
        <TextInput
          key={id}
          ref={(ref) => this.setInputRef(id, ref)}
          clearTextOnFocus
          onChangeText={(text) => this.handleEdit(text, id)}
          onFocus={() => this.setState({focussed: id})}
          value={this.state.code[id] ? this.state.code[id].toString() : ''}
          style={styles.pinTextInput}
          returnKeyType={'done'}
          autoCapitalize={'sentences'}
          autoCorrect={false}
        />
      );
    }

    return (
      <View style={styles.pincodeScreen}>
        <Text style={styles.pincodeHeader}>Security</Text>

        <Text style={styles.pincodeText}>
          Enter a 4-digit pincode in case you
          get locked out or move to a new phone.
        </Text>

        <View style={styles.pinView}>
          {pins}
        </View>

        {this.state.complete &&
          <Button
            raised
            backgroundColor='#8795E8'
            color='#ffffff'
            onPress={() => navigate('Instructions')}
            icon={{name: 'lock-outline'}}
            title='Continue' />}
      </View>
    );
  }
}

// http://www.colourlovers.com/palette/3636765/seapunk_vaporwave
// http://www.colourlovers.com/palette/3887337/Pale_Glitter

const styles = StyleSheet.create({
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
  }
});
