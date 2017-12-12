import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
//import { ImagePicker } from 'expo';
import { MapView } from 'expo';
import { ScrollView, View, Text, TouchableHighlight, Dimensions, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from 'react-native-slider';
import { connect } from 'react-redux';
import { Card, CardSection, Input, Button, Label } from '../components/common';
import { eventCreate, notifyFollowers } from '../actions/EventActions';

console.ignoredYellowBox = [
    'Setting a timer'
];

const { width } = Dimensions.get('window');
const today = moment(new Date()).format('DD-MM-YYYY HH:mm');
const tomorrow = moment().add(1, 'days');
const maxDate = moment().add(1, 'months');

class EventCreate extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Nuovo evento',
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
              'In questa schermata puoi inserire i dati dell\'evento che vuoi creare. \n\nInserisci:\n- Un titolo conciso che faccia capire cosa vuoi fare.\n- Un luogo (es. nome di un campo sportivo).\n- Il limite di partecipanti muovendo lo slider.\n- Il giorno e l\'orario di quando si svolgerà l\'evento.\n- La posizione sulla mappa tenendo premuto il segnalino e spostandolo.\n\nQuesti dati sarano visibili agli altri utenti.\n\n ',
              [{ text: 'Ho capito' }]);
            }}
          />
      </TouchableOpacity>
  })
  state = {
    title: '',
    location: '',
    duedate: null, //tomorrow.toISOString(), //new Date().toISOString(),
    image: 'https://facebook.github.io/react/img/logo_og.png',
    link: '',
    owner: '',
    slider: '51',
    latitude: 37.511291,
    longitude: 15.083441,
  }

  onRegionChange(region) {
    console.log('onRegionChange');
    this.setState({ region });
  }

sliderText(sliderValue) {
  if (sliderValue > 50) {
    return 'infiniti';
  }
  return sliderValue;
}

  render() {
    return (
      <ScrollView>
        <Card>
          <CardSection>
            <Input
              label="Nome"
              placeholder="es. Partita amichevole"
              value={this.state.title}
              onChangeText={text => this.setState({ title: text })}
            />
          </CardSection>

          <CardSection>
            <Input
              label="Dove si terrà?"
              placeholder="es. CUS Catania"
              value={this.state.location}
              onChangeText={text => this.setState({ location: text })}
              styles={{ alignItems: 'center' }}
            />
          </CardSection>
          <CardSection style={styles.containerStyle}>
            <Text style={styles.labelStyle}>
              Partecipanti: {this.sliderText(this.state.slider)}
            </Text>
            <View style={{ paddingLeft: 10, flex: 4 }}>
              <Slider
                minimumValue={2}
                maximumValue={51}
                step={1}
                value={51}
                style={{ flex: 1 }}
                onValueChange={slider => this.setState({ slider })}
              />
            </View>
          </CardSection>

          <CardSection>
            <DatePicker
              style={{ flex: 1 }}
              date={this.state.duedate}
              mode="datetime"
              placeholder="cliccami per impostare il giorno dell'evento"
              format="DD-MM-YYYY  -  HH:mm"
              minDate={tomorrow}
              maxDate={maxDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 25
                },
                dateInput: {
                  marginLeft: 100,
                  borderWidth: 0,
                  color: 'black'
                }
              }}
              onDateChange={(date) => {
                 this.setState({ duedate: date });
               }}
            />
          </CardSection>

          {/*<Image />*/}
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
            <MapView
              style={{ width, height: 300 }}
              initialRegion={{
                latitude: 37.511291,
                longitude: 15.083441,
                latitudeDelta: 0.025,
                longitudeDelta: 0.025
              }}
            >
              <MapView.Marker
                draggable
                coordinate={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                onDragEnd={(e) => {
                  this.setState({ latitude: e.nativeEvent.coordinate.latitude, longitude: e.nativeEvent.coordinate.longitude });
                  console.log('la latitude dopo il drag: ', this.state.latitude);
                  console.log('la longitude dopo il drag: ', this.state.longitude);
                }}
                title={'Il tuo evento'}
              >
                <MapView.Callout >
                  <TouchableHighlight onPress={() => this.markerClick()} underlayColor='#dddddd'>
                      <View>
                          <Text>Il tuo evento</Text>
                      </View>
                  </TouchableHighlight>
                </MapView.Callout>
            </MapView.Marker>
          </MapView>
          </CardSection>

          <CardSection>
            <Button
              onPress={async() => {
                if (this.state.title === '') {
                  Alert.alert(
                    'Errore!',
                    'Devi inserire un titolo!',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                } else if (this.state.location === '') {
                  Alert.alert(
                    'Errore!',
                    'Devi inserire un luogo!',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                } else if (this.state.duedate === null) {
                  Alert.alert(
                    'Errore!',
                    'Devi inserire una data!',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                } else {
                  Alert.alert(
                    'Creazione avvenuta con successo!',
                    'Hai creato un nuovo evento! Riceverai una notifica quando ci saranno dei partecipanti',
                    [
                      { text: 'Ho capito', style: 'cancel' }
                    ]
                  );
                  this.props.eventCreate({
                    title: `${this.state.title} `,
                    location: this.state.location,
                    duedate: this.state.duedate,
                    navigateTo: (screen) => this.props.navigation.navigate(screen),
                    //image: this.state.image,
                    path: this.props.path,
                    slider: this.state.slider,
                    latitude: this.state.latitude,
                    longitude: this.state.longitude,
                  });
                  await this.props.notifyFollowers({
                    path: this.props.path,
                    msg: 'Nuovo evento nella categoria'
                  });
                }
              }}
            >
              Invia
            </Button>
          </CardSection>
        </Card>
      </ScrollView>
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
      color: '#007aff',
      fontSize: 16,
      fontWeight: '600',
      paddingTop: 10,
      paddingBottom: 10
    },
  buttonStyle: {
      flex: 1,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#007aff',
      alignItems: 'center',
      marginLeft: 5,
      marginRight: 5,
    },
  inputStyle: {
      color: '#000',
      paddingRight: 5,
      paddingLeft: 5,
      paddingTop: 5,
      fontSize: 18,
      lineHeight: 5,
      flex: 2
    },
  labelStyle: {
      fontSize: 17,
      paddingLeft: 20,
      flex: 3,
      // borderWidth: 1,
      // borderColor: 'black',
      backgroundColor: 'transparent',
      paddingRight: -20
      //alignItems: 'space-around'
    },
  containerStyle: {
      // height: 40,
      flex: 7,
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
      justifyContent: 'space-around'
    }
});

const mapStateToProps = state => ({
  path: state.auth.path
});

export default connect(mapStateToProps, { eventCreate, notifyFollowers })(EventCreate);
