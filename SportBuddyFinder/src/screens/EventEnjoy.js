import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import { ScrollView, TouchableOpacity, Dimensions, Alert, StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { MapView } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';
//import { ImagePicker } from 'expo';
import { Card, CardSection, Button, Label } from '../components/common';
import { eventEdit, contaPartecipanti, enjoy, notEnjoy, doYouEnjoyed } from '../actions/EventActions';
import { getUserId, getTokenId } from '../actions/AuthActions';

const { width } = Dimensions.get('window');

class EventEnjoy extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Partecipa all\'evento!',
    headerLeft:
      <TouchableOpacity style={styles.icon}>
          <MaterialIcons
            name="home"
            size={30}
            color="black"
            style={{ position: 'absolute', left: 10 }}
            onPress={() => {
            console.log('tasto home');
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
              'In questa schermata cliccando il tasto "Enjoy" puoi partecipare all\'evento',
              [{ text: 'Ho capito' }]);
            }}
          />
      </TouchableOpacity>
  });

  state = {
    title: '',
    location: '',
    duedate: null, //tomorrow.toISOString(), //new Date().toISOString(),
    image: 'https://facebook.github.io/react/img/logo_og.png',
    link: '',
    owner: '',
    slider: '',
    latitude: 37.511291,
    longitude: 15.083441,
    path: ''
  };

  componentWillMount() {
    console.log('monto eventEnjoy');
    const { event } = this.props.navigation.state.params;
    console.log('in eventEnjoy quando monto il path è:', this.props.path);
    if (event) {
      this.setState({
        title: event.title,
        location: event.location,
        duedate: event.duedate,
        image: event.image || this.state.image,
        owner: event.owner,
        slider: event.slider,
        latitude: event.latitude,
        longitude: event.longitude,
        id: event.id,
        path: this.props.path,
        partecipanti: contaPartecipanti(this.props.path, event.id)
      });
    }
  }

  renderSwitchEnjoy() {
    const flag = doYouEnjoyed(this.state.path, this.state.id, this.props.email);
    console.log('passo la path ', this.state.path);
    if (flag) {
      return (
        <Button
          onPress={() => {
            Alert.alert(
              'Partecipazione all\'evento',
              'Sei sicuro di voler annullare la partecipazione a questo evento?',
              [
                { text: 'Annulla', style: 'cancel' },
                { text: 'Si',
                  onPress: () => {
                        console.log('not enjoy button!');
                        const user = getUserId();
                        const token = getTokenId(user);
                        // console.log('enjoy button! - userId ', user);
                        // console.log('enjoy button! - token ', token);
                        this.props.notEnjoy({
                          user,
                          tokenUser: token,
                          id: this.state.id,
                          path: this.props.path,
                          navigateTo: (screen) => this.props.navigation.navigate(screen)
                        });
                      }
                    }
                ]
              );
            }}
        >
          Annulla partecipazione
        </Button>
      );
    }
    return (
      <Button
        onPress={() => {
          Alert.alert(
            'Partecipazione all\'evento',
            'Sei sicuro di voler partecipare a questo evento?',
            [
              { text: 'Annulla', style: 'cancel' },
              { text: 'Si',
                onPress: () => {
                  const x = contaPartecipanti(this.state.path, this.state.id);
                  this.setState({ partecipanti: x });
                  if (x >= this.state.slider) {
                    Alert.alert(
                      'Impossibile partecipare all\'evento!',
                      'Questo evento è già pieno.\nCerca un altro evento o creane uno tu stesso!',
                      [
                        { text: 'Ho capito', style: 'cancel' }
                      ]
                    );
                  } else {
                      console.log('enjoy button!');
                      const user = getUserId();
                      const token = getTokenId(user);
                      // console.log('enjoy button! - userId ', user);
                      // console.log('enjoy button! - token ', token);
                      this.props.enjoy({
                        user,
                        email: this.props.email,
                        tokenUser: token,
                        id: this.state.id,
                        path: this.state.path,
                        navigateTo: (screen) => this.props.navigation.navigate(screen)
                      });
                    }
                  }
                }
              ]
            );
          }}
      >
        Enjoy!
      </Button>
    );
  }

  // _pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     allowsEditing: true,
  //     aspect: [4, 3]
  //   });
  //
  //   //console.log(result);
  //
  //   if (!result.cancelled) {
  //     this.setState({ image: result.uri });
  //   }
  // };

  render() {
    return (
      <ScrollView>
        <Card>
          <CardSection>
            <Label
              label='Nome'
              label2={this.state.title}
            />
          </CardSection>
          <CardSection>
            <Label
              label='Dove si terrà?'
              label2={this.state.location}
            />
          </CardSection>
          <CardSection>
            <Label
              label='Numero partecipanti'
              label2={`${this.state.partecipanti} / ${this.state.slider}`}
            />
          </CardSection>
          <CardSection>

            <DatePicker
              disabled
              style={{ flex: 1 }}
              date={this.state.duedate}
              mode='datetime'
              placeholder='Errore'
              format='DD-MM-YYYY  -  HH:mm'
              confirmBtnText='Confirm'
              cancelBtnText='Cancel'
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 16
                },
                dateInput: {
                  marginLeft: 120
                }
              }}
            />
          </CardSection>

          <CardSection>
            <MapView
              style={{ width, height: 300 }}
              initialRegion={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
              }}
            >
              <MapView.Marker
                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                title={'lol'}
              >
                <MapView.Callout >
                  <TouchableHighlight onPress={() => this.markerClick()} underlayColor='#dddddd'>
                      <View>
                          <Text>{this.state.title}</Text>
                      </View>
                  </TouchableHighlight>
                </MapView.Callout>
            </MapView.Marker>
          </MapView>
          </CardSection>

          {/*<CardSection>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flex: 1
              }}
            >
              <Image
                source={{ uri: this.state.image }}
                style={{ height: 200, width: '100%' }}
              />
            </TouchableOpacity>
          </CardSection>*/}

          <CardSection>
            {this.renderSwitchEnjoy()}
          </CardSection>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  header: {
    marginTop: 20
  },
  icon: {
    width: 50,
    height: 50,
    //borderWidth: 1,
    //borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  }
});


const mapStateToProps = state => ({
  path: state.auth.pathPrev,
  email: state.auth.email
});

export default connect(mapStateToProps, { eventEdit, contaPartecipanti, enjoy, notEnjoy, doYouEnjoyed })(EventEnjoy);
