import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import store from '../state/store';

// Initial app loading screen

export default class Loading extends React.Component {
  render () {
    const { navigation: { navigate } } = this.props;

    // fixme - wait for store to load or do something better than this
    setTimeout(() => {
      navigate(store.loggedIn ? 'Main' : 'Welcome');
    }, 100);

    return (
      <View style={styles.view}>
        <Icon name='fingerprint' size={42} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
