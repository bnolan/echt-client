import * as Animatable from 'react-native-animatable';
import React from 'react';
import styles, {colors} from '../styles';
import { Button } from 'react-native-elements';
import { View } from 'react-native';

class Welcome extends React.Component {
  nextScreen () {

  }
  render () {
    const { navigation: { navigate } } = this.props;

    return (
      <View style={[styles.container, styles.welcomeScreen]}>
        <Animatable.Text
          animation='fadeInUp'
          style={styles.header}>
          Welcome!
        </Animatable.Text>

        <Animatable.Text
          style={styles.text}
          animation='fadeIn'
          delay={250}>
          Welcome to Echt, the photo sharing app
          for friends. Echt is different
          because you have to take selfies with your friends
          to add them.
        </Animatable.Text>

        <Animatable.View
          style={styles.viewCentered}
          animation='fadeIn'
          delay={500}>
          <Button
            raised
            onPress={() => navigate('Selfie')}
            color={colors.textDark}
            backgroundColor={colors.bgLight}
            icon={{name: 'keyboard-arrow-right', color: colors.textDark}}
            style={styles.welcomeButton}
            title='Continue' />
        </Animatable.View>
      </View>
    );
  }
}

export default Welcome;
