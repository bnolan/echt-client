import React from 'react';
import store from '../state/store';
import { observer } from 'mobx-react/native';
import { Alert } from 'react-native';
import styles from './styles';
// import codePush from 'react-native-code-push';

import {
  Body,
  Button,
  Col,
  Container,
  Grid,
  Header,
  Row,
  Text,
  Title
} from 'native-base';

@observer export default class Settings extends React.Component {
  constructor () {
    super();

    this.state = {
      label: undefined,
      version: undefined
    };
  }

  get version () {
    return this.state.version ? `${this.state.version}.${this.state.label}` : 'development';
  }

  setUser (name) {
    const keys = {
      // userId: 302f590b-7932-490b-a4e2-5fd6f1c7df59
      ben: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzMDJmNTkwYi03OTMyLTQ5MGItYTRlMi01ZmQ2ZjFjN2RmNTkiLCJkZXZpY2VJZCI6IjgzMWM1OWQ2LTc2MWUtNDQ2YS1iNGE3LTE1NjE0N2NkZDE5MCIsImlhdCI6MTQ5MDEwOTEyOX0.',
      // userId: 350bb912-11c4-414d-8bd7-446fbd80d475
      ingo: 'eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VySWQiOiIzNTBiYjkxMi0xMWM0LTQxNGQtOGJkNy00NDZmYmQ4MGQ0NzUiLCJkZXZpY2VJZCI6ImNhOWRiYTY1LWU2YjItNDk4Zi05YzhhLTczOTJiZDc4ZTI5MiIsImlhdCI6MTQ5MDEwOTE0NH0.'
    };

    store.setDeviceKey(keys[name]);
  }

  componentDidMount () {
    // codePush.getUpdateMetadata().then((metadata) =>{
    //   this.setState({label: metadata.label, version: metadata.appVersion, description: metadata.description});
    // });
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
    // <Text>v{this.state.version}.{this.state.label}</Text>
    // { store.isDevMode && <Debug /> }

    /*
      <Button warning bordered onPress={() => this.onClearUser()}>
        <Text>Log out</Text>
      </Button>
    */

    return (
      <Container style={styles.container}>
        <Header>
          <Body>
            <Title>Settings</Title>
          </Body>
        </Header>

        <Grid style={[styles.container, styles.margin15]}>
          <Row>
            <Text style={styles.lightText}>App version {this.version}.</Text>
          </Row>

          <Row style={styles.flex0}>
            <Grid>
              <Col>
                <Button bordered block danger onPress={() => this.onDeleteAccount()}>
                  <Text>Delete Account</Text>
                </Button>
              </Col>
            </Grid>
          </Row>
        </Grid>
      </Container>
    );
  }
}
