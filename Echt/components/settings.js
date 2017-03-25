import React from 'react';
import { AsyncStorage, TouchableHighlight, StyleSheet, Text, View } from 'react-native';

export default class Settings extends React.Component {
  setUser (name) {
    const keys = {
      ben: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0.',
      ingo: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzNTBiYjkxMi0xMWM0LTQxNGQtOGJkNy00NDZmYmQ4MGQ0NzUiLCJkZXZpY2VJZCI6ImNhOWRiYTY1LWU2YjItNDk4Zi05YzhhLTczOTJiZDc4ZTI5MiIsImlhdCI6MTQ5MDEwOTE0NH0.'
    };

    AsyncStorage.setItem('userName', name);
    AsyncStorage.setItem('deviceKey', keys[name]);

    this.props.onClose();
  }

  render () {
    return (
      <View style={styles.userList}>
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
  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userList: {
    flexDirection: 'column',
    flex: 1,
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 2, height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 8
  },

  userButton: {
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: '#eee'
  },

  userText: {
    padding: 10
  }
});
