import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
//import { ImagePicker } from 'expo';
import { View, Image, TouchableOpacity, Text, Alert, StyleSheet, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { Card, CardSection, Input, Button, Spinner } from '../components/common';
import { userProfile, userLoad, logOut } from '../actions/AuthActions';

class ProfileScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Il tuo profilo',
    headerLeft:
      <TouchableOpacity style={styles.icon}>
          <MaterialIcons
            name="home"
            size={30}
            color="black"
            style={{ position: 'absolute', left: 10 }}
            onPress={() => {
                console.log('tasto back');
                navigation.navigate('categories');
            }}
          />
      </TouchableOpacity>,
    headerRight:
      <TouchableOpacity style={styles.icon}>
          <MaterialIcons
            name="help"
            size={40}
            color="black"
            style={{ position: 'absolute' }}
            onPress={() => {
              Alert.alert(
              'Aiuto',
              'Questa è la schermata del profilo utente, qui puoi modificare i tuoi dati o effettuare il logout',
              [{ text: 'Ho capito' }]);
            }}
          />
      </TouchableOpacity>
  })

  state = {
    name: '',
    surname: '',
    born: new Date().toISOString(),
    image: 'https://facebook.github.io/react/img/logo_og.png',
    interests: '',
    alias: '',
    phone: '',
    tutorial: '',
    token: ''
  }

  componentWillMount() {
    console.log('monto profilescreen');
    //console.log('image op', this.props.image);
     this.setState({
       name: this.props.name,
       email: this.props.email,
       surname: this.props.surname,
       born: this.props.born,
       token: this.props.token
     });
    //  if (this.props.image !== null) {
    //    this.setState({ image: this.props.image });
    //  } else {
    //    this.setState({ image: 'https://facebook.github.io/react/img/logo_og.png' });
    //  }
  }

  // _pickImage = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //   });
  //   //console.log(result);
  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // };

  render() {
    return (
      <View>
        <Card>

          {/*<CardSection>
            <Text
              style={{
                paddingTop: 10,
                fontSize: 18,
                paddingLeft: 20,
              }}
            >
              Inserisci una tua foto:
            </Text>
          </CardSection>*/}

          {/*<CardSection>
            <TouchableOpacity
              style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  flex: 1
              }}
              onPress={this._pickImage}
            >
              <Image
                source={{ uri: this.state.image }}
                resizeMode="cover"
                style={{ height: 200, width: 300 }}
              />
            </TouchableOpacity>
          </CardSection>*/}

          <CardSection>
            <Input
              label="Nome:"
              placeholder="Mario"
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Cognome:"
              placeholder="Rossi"
              value={this.state.surname}
              onChangeText={text => this.setState({ surname: text })}
            />
          </CardSection>

          <CardSection>
            <Text
              style={{
                paddingTop: 10,
                fontSize: 18,
                paddingLeft: 20,
          }}>
              Data di nascita:
            </Text>
            <DatePicker
              style={{ flex: 1 }}
              date={this.state.born}
              mode="date"
              placeholder={this.state.born}
              format="DD-MM-YYYY"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 16
                },
                dateInput: {
                  marginLeft: 10
                }
              }}
              onDateChange={(date) => { this.setState({ born: date }); }}
            />
          </CardSection>

        <CardSection>
            <Button
              onPress={() => {
                Alert.alert(
                  'Modifica avvenuta con successo!',
                  'Hai modificato il tuo profilo!',
                  [
                    { text: 'Ho capito', style: 'cancel' }
                  ]
                );
                this.props.userProfile({
                name: this.state.name,
                email: this.state.email,
                surname: this.state.surname,
                born: this.state.born,
                tutorial: this.state.tutorial,
                token: this.state.token,
                navigateTo: (screen) => this.props.navigation.navigate(screen),
                //image: this.state.image
              });
            }}
            >
              Save
            </Button>
          </CardSection>

          <CardSection style={styles.containerStyle}>
            <TouchableOpacity
              style={[styles.buttonStyle, { borderColor: 'green' }]}
              onPress={
                () => {
                  try {
                    AsyncStorage.setItem('@MySuperStore:tutorial', 'yes');
                    //this.setState({ tutorial: 'yes' });
                    console.log('setto yes');
                    Alert.alert(
                      'Tutorial riattivato',
                      'Torna alla home per vedere di nuovo l\'avviso del tutorial',
                      [
                        { text: 'Ho capito', style: 'cancel' }
                      ]
                    );
                  } catch (error) {
                    console.log('errore set');
                  }
                }
              }
            >
              <Text style={[styles.textStyle, { color: 'green' }]}>
                Riattiva tutorial
              </Text>
            </TouchableOpacity>
          </CardSection>

          <CardSection style={styles.containerStyle}>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => this.props.logOut({
                  navigateTo: (screen) => this.props.navigation.navigate(screen)
                  //image: this.state.image
                })}
              >
                <Text style={styles.textStyle}>
                  Logout
                </Text>
              </TouchableOpacity>
            </CardSection>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
icon: {
    width: 50,
    height: 50,
    //borderWidth: 1,
    //borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textStyle: {
    alignSelf: 'center',
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    marginLeft: 5,
    marginRight: 5,
  }
});

const mapStateToProps = state => ({
  isLoading: state.auth.loading,
  name: state.auth.name,
  email: state.auth.email,
  surname: state.auth.surname,
  born: state.auth.born,
  token: state.auth.token,
  //image: state.auth.image
});

export default connect(mapStateToProps, { userProfile, userLoad, logOut })(ProfileScreen);
