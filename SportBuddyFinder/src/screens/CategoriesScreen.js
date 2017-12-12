import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// import Footer from '../components/Footer';
import VisibleCategoryList from '../containers/VisibleCategoryList';

console.log('sono su CategoriesScreen');
const CategoriesScreen = ({ navigation }) => (
  <View style={styles.container} >
      <VisibleCategoryList
        onClick={
          event => navigation.navigate('home', { event })
        }
      />
    {/*<Footer />*/}
  </View>
);

CategoriesScreen.navigationOptions = ({ navigation }) => ({
  title: 'Categorie',
  headerLeft: null,
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
            'Questa è la schermata delle categorie di sport presenti, clicca su una di esse per entrarci oppure tieni premuto per metterla o toglierla dai preferiti, così da ricevere una notifica quando qualcuno aggiunge un nuovo evento. Le categorie che stai seguendo sono contrassegnate da una stella',
            [{ text: 'Ho capito' }]);
          }}
        />
    </TouchableOpacity>
    <TouchableOpacity style={styles.icon}>
        <MaterialIcons
          name="assignment-ind"
          size={40}
          color="black"
          style={{ position: 'absolute' }}
          onPress={() => navigation.navigate('profile')}
        />
    </TouchableOpacity>
  </View>

});

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
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  }
});

export default CategoriesScreen;
