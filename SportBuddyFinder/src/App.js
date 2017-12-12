import React from 'react';
import { StatusBar, Platform, BackHandler, ToastAndroid } from 'react-native';
//import { downloadInitialEventlist } from './actions';
//import { logger } from 'redux-logger';
import { StackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import appReducer from './reducers';
import HomeScreen from './screens/HomeScreen';
import LoginForm from './screens/LoginForm';
import EventCreate from './screens/EventCreate';
import EventEdit from './screens/EventEdit';
import EventEnjoy from './screens/EventEnjoy';
import ProfileScreen from './screens/ProfileScreen';
import CategoriesScreen from './screens/CategoriesScreen';

const initialState = {};

class App extends React.Component {

  constructor(props) {
        super(props);
        this.backButtonListener = null;
        this.currentRouteName = 'Main';
        this.lastBackButtonPress = null;
    }

    componentWillMount() {
      const config = {
      apiKey: 'AIzaSyBT8QF2CoDPOsw5VSHAeAT_gEXfSiDL2r4',
      authDomain: 'todolist-rn.firebaseapp.com',
      databaseURL: 'https://todolist-rn.firebaseio.com',
      projectId: 'todolist-rn',
      storageBucket: 'todolist-rn.appspot.com',
      messagingSenderId: '1045704191206'
      };
      firebase.initializeApp(config);
    }

    componentDidMount() {
        // disabilita tasto back fisico

        if (Platform.OS === 'android') {
            this.backButtonListener = BackHandler.addEventListener('hardwareBackPress', () => {
                if (this.currentRouteName !== 'Main') {
                    return false;
                }

                if (this.lastBackButtonPress + 2000 >= new Date().getTime()) {
                    BackHandler.exitApp();
                    return true;
                }
                ToastAndroid.show('Clicca di nuovo per uscire dall\'app', ToastAndroid.SHORT);
                this.lastBackButtonPress = new Date().getTime();

                return true;
            });
        }
    }

    componentWillUnmount() {
        this.backButtonListener.remove();
    }

  render() {
    const store = createStore(
      appReducer,
      initialState,
      applyMiddleware(/*logger,*/ ReduxThunk)
    );
    // store.dispatch(downloadInitialEventlist());

    const MainNavigator = StackNavigator({
      // eventCreate: { screen: EventCreate },
      login: { screen: LoginForm },
      home: { screen: HomeScreen },
      profile: { screen: ProfileScreen },
      eventCreate: { screen: EventCreate },
      eventEdit: { screen: EventEdit },
      categories: { screen: CategoriesScreen },
      enjoy: { screen: EventEnjoy }
    },
    {
        cardStyle: {
          paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight
      }
  });

    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

export default App;
