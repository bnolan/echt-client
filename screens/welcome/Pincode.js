import React from 'react';
import { Text, View, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../styles';

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
      <View style={[styles.container, styles.pincodeScreen]}>
        <Text style={styles.header}>Security</Text>

        <Text style={styles.text}>
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
