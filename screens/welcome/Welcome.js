import React from 'react';
import styles, {colors} from '../styles';
import { Button } from 'react-native-elements';
import { Icon, Button } from 'react-native-elements';
import { Text, View } from 'react-native';

class Welcome extends React.Component {
  nextScreen () {

  }
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={[styles.container, styles.welcomeScreen]}>
        <Text style={styles.header}>
          Welcome!
        </Text>

        <Text style={styles.text}>
          Welcome to Echt, the photo sharing app
          for friends. Echt is different
          because you have to take selfies with your friends
          to add them.
        </Text>

        <View style={styles.viewCentered}>
          <Button
            raised
            onPress={() => navigate('Selfie')}
            color={colors.textDark}
            backgroundColor={colors.bgLight}
            icon={{name: 'keyboard-arrow-right', color: colors.textDark}}
            style={styles.welcomeButton}
            title='Continue' />
        </View>
      </View>
    );
  }
}

export default Welcome;
