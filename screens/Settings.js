import React from 'react';
import store from '../state/store';
import { Button } from 'react-native-elements';
import { observer } from 'mobx-react/native';
import { Alert, StyleSheet, Text, View } from 'react-native';

@observer export default class Settings extends React.Component {
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
    store.clear();
  }

  onClearUser () {
    Alert.alert(
      'Log out',
      'Do you want to log out? You will lose access to this account.',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            console.log('Yes Pressed');
            this.clearUser();
          }
        }
      ],
      { cancelable: false }
    );
  }

  deleteUser () {
    store.deleteUser();
  }

  onDeleteAccount () {
    Alert.alert(
      'Delete Account',
      'Do you want to delete your account?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            console.log('Yes Pressed');
            this.deleteUser();
          }
        }
      ],
      { cancelable: false }
    );
  }

  render () {
    // { store.isDevMode && <Debug /> }

    return (
      <View style={styles.settings}>
        <Text style={styles.header}>Settings.</Text>

        <View style={styles.actionContainer}>
          <Button
            raised
            backgroundColor='#999'
            color='#fff'
            onPress={() => this.onClearUser()}
            icon={{name: 'lock-outline'}}
            title='Log out' />
        </View>

        <View style={styles.actionContainer}>
          <Button
            raised
            backgroundColor='#bbb'
            color='#ddd'
            onPress={() => this.onDeleteAccount()}
            icon={{name: 'report'}}
            title='Delete Account' />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    padding: 20
  },

  header: {
    color: '#666666',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -1,
    margin: 20
  },

  userButton: {
    marginTop: 12,
    borderRadius: 4,
    backgroundColor: '#eee'
  },

  actionContainer: {
    width: 220,
    marginTop: 20
  },

  userText: {
    padding: 10
  }
});
