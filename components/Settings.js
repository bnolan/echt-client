import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import store from '../state/store';
import { Button } from 'react-native-elements';

@observer
export default class Settings extends React.Component {
  setUser (name) {
    const keys = {
      // userId: 302f590b-7932-490b-a4e2-5fd6f1c7df59
      ben: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0.',
      // userId: 350bb912-11c4-414d-8bd7-446fbd80d475
      ingo: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzNTBiYjkxMi0xMWM0LTQxNGQtOGJkNy00NDZmYmQ4MGQ0NzUiLCJkZXZpY2VJZCI6ImNhOWRiYTY1LWU2YjItNDk4Zi05YzhhLTczOTJiZDc4ZTI5MiIsImlhdCI6MTQ5MDEwOTE0NH0.'
    };

    store.setDeviceKey(keys[name]);
  }

  clearUser () {
    const { navigation: { navigate } } = this.props;

    store.clear().then(() => {
      navigate('Loading');
    });
  }

  render () {
    return (
      <View>
        <View style={styles.userButton}>
          <TouchableHighlight underlayColor='#ccc' onPress={(e) => this.setUser('ben')}>
            <Text style={styles.userText}>Become 👨 Ben</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.userButton}>
          <TouchableHighlight underlayColor='#ccc' onPress={(e) => this.setUser('ingo')}>
            <Text style={styles.userText}>Become 👳 Ingo</Text>
          </TouchableHighlight>
        </View>

        <View>
          <Button
            raised
            backgroundColor='#ff00aa'
            color='#ffffff'
            onPress={() => this.clearUser()}
            iconName='delete'
            title='Sign out' />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  userButton: {
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: '#eee'
  },

  userText: {
    padding: 10
  }
});
