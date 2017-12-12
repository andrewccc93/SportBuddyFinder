import React, { Component } from 'react';
import { Permissions, Notifications } from 'expo';
import { connect } from 'react-redux';
import { ScrollView, Text, Image, Dimensions, Alert, StyleSheet } from 'react-native';
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { loginUser, loginUserCreate, userProfile } from '../actions/AuthActions';
import { Notifica } from '../actions/EventActions';


const { width, height } = Dimensions.get('window');
const imageY = height / 3;

class LoginForm extends Component {
  static navigationOptions = {
    title: 'Login',
    headerLeft: null,
  }
  state = {
    email: 'pippo@mail.com',
    password: 'pippo1234',
    token: '',
    notification: {},
    flag: false,
  }

  componentWillMount() {
    this.registerForPushNotificationsAsync();
    this.notificationSubscription = Notifications.addListener(this.handleNotification);
  }

  handleNotification = (notification) => {
    this.setState({ notification });
  };

  async registerForPushNotificationsAsync() {
      const { existingStatus } = await Permissions.getAsync(Permissions.REMOTE_NOTIFICATIONS);
      let finalStatus = existingStatus;

      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.REMOTE_NOTIFICATIONS);
        finalStatus = status;
      }
      console.log('Remote Notifications Permissions', finalStatus);

      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }

      // Get the token that uniquely identifies this device
      const token = await Notifications.getExponentPushTokenAsync();
      console.log(token);
      this.setState({ token });
  }

  renderLoginOrSpinner() {
    if (this.props.isLoading) {
      return <Spinner />;
    }
    return (
      <Button
        onPress={() => {
          this.props.loginUser({
          email: this.state.email,
          password: this.state.password,
          navigateTo: (screen) => this.props.navigation.navigate(screen),
          firstAccess: false,
          token: this.state.token
        });
        }
      }
      >
        Login
      </Button>
    );
  }

  renderSecondPasswordField() {
    if (this.state.flag) {
      return (
      <CardSection>
        <Input
          secureTextEntry
          label=' Ripeti la Password'
          placeholder='password'
          onChangeText={text => this.setState({ password2: text })}
          value={this.state.password2}
        />
      </CardSection>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <Card>
          <CardSection>
            <Image
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1
              }}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/logo.jpg?alt=media&token=ba04f4c2-0781-4617-bfe4-1a35e11ec71c' }}
              resizeMode="cover"
              style={{ marginTop: 10, marginLeft: -10, height: imageY, width }}
            />
          </CardSection>
        </Card>
        <Card>
          <CardSection>
            <Input
              label='E-mail'
              placeholder='example@email.com'
              onChangeText={text => this.setState({ email: text })}
              value={this.state.email}
            />
          </CardSection>

          <CardSection>
            <Input
              secureTextEntry
              label='Password'
              placeholder='password'
              onChangeText={text => this.setState({ password: text })}
              value={this.state.password}
            />
          </CardSection>

          {this.renderSecondPasswordField()}

          <CardSection>
            <Text style={{ fontSize: 15, color: 'red' }}>{this.props.error.message}</Text>
          </CardSection>
          <CardSection>
            {this.renderLoginOrSpinner()}
          </CardSection>

          <CardSection>
            <Button
              onPress={() => {
                if (!this.state.flag) {
                  Alert.alert(
                    'Avviso',
                    'Inserisci email e password. Dopo clicca su registrati!',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                  this.setState({ email: '' });
                  this.setState({ password: '' });
                  this.setState({ password2: '' });
                  this.setState({ flag: true });
                } else if (this.state.password === this.state.password2) {
                  this.props.loginUserCreate({
                  email: this.state.email,
                  password: this.state.password,
                  firstAccess: true,
                  token: this.state.token,
                  navigateTo: (screen) => this.props.navigation.navigate(screen)
                  });
                } else {
                  Alert.alert(
                    'Avviso',
                    'Le 2 password non corrispondono. Immetti la stessa password in entrambi i campi',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                  this.setState({ password: '' });
                  this.setState({ password2: '' });
                }
              }
            }
            >
              Registrati
            </Button>
          </CardSection>
        </Card>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.auth.loading,
  error: state.auth.error
});

export default connect(mapStateToProps, { loginUser, loginUserCreate, userProfile, Notifica })(LoginForm);
