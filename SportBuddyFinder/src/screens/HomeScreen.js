import React from 'react';
import { View, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
// import Footer from '../components/Footer';
import VisibleEventlist from '../containers/VisibleEventlist';

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Eventi in corso',
    headerLeft:
      <TouchableOpacity style={styles.icon}>
          <MaterialIcons
            name="chevron-left"
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
      <View style={styles.view}>
        <TouchableOpacity style={styles.icon}>
            <MaterialIcons
              name="help"
              size={40}
              color="black"
              style={{ position: 'absolute' }}
              onPress={() => {
                Alert.alert(
                'Aiuto',
                'In questa schermata sono presenti tutti gli eventi della categoria su cui hai cliccato.\n\nPer creare un nuovo evento clicca nell\'icona con il simbolo "+" in alto a destra.\n\nPer tornare alla schermata delle categorie premi la freccia in alto a sinistra.\n\nPer cancellare un evento premi e tieni premuto (puoi cancellare solo gli eventi che hai creato tu)\n\nGli eventi in blu sono i tuoi eventi, quelli in nero sono gli eventi di altri utenti e quelli in verde sono gli eventi a cui stai partecipando',
                [{ text: 'Ho capito' }]);
              }}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
            <MaterialIcons
              name="add-circle-outline"
              size={40}
              color="black"
              style={{ position: 'absolute' }}
              onPress={() => navigation.navigate('eventCreate')}
            />
        </TouchableOpacity>
      </View>
  });

  componentWillMount() {
    console.log('id user:', this.props.IdUser);
  }

render() {
  return (
    <View style={styles.container} >
      <VisibleEventlist
         onClick={(event) => {
          //  console.log('id event ', event.id);
          //  console.log('id event owner:', event.owner);
           if (event.owner !== this.props.IdUser) {
               this.props.navigation.navigate('enjoy', { event });
           } else {
               this.props.navigation.navigate('eventEdit', { event });
           }
         }}
      />
    {/*<Footer />*/}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // borderColor: 'black',
    // borderWidth: 13
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
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  }
});

const mapStateToProps = state => ({
  IdUser: state.auth.user,
  path: state.auth.path
});

export default connect(mapStateToProps, null)(HomeScreen);
