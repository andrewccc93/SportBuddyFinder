import firebase from 'firebase';
import { Alert, AsyncStorage } from 'react-native';
import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER_START,
  CREATE_PROFILE,
  LOAD_PROFILE_SUCCESS,
} from './types';

export const loginUser = ({ email, password, navigateTo, firstAccess, token }) => {
  return (dispatch) => {
    console.log('Siamo nella loginUser action: ', email, password);
    dispatch({ type: LOGIN_USER_START });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(user => loginUserSuccess(dispatch, user, navigateTo, firstAccess, token, email))
      .catch(error => loginUserFailed(dispatch, error)
      );
  };
};

export const loginUserCreate = ({ email, password, navigateTo, firstAccess, token }) => {
  return (dispatch) => {
    console.log('creo il nuovo user', email);
    dispatch({ type: LOGIN_USER_START });
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(user => loginUserSuccess(dispatch, user, navigateTo, firstAccess, token, email))
          .catch(error => loginUserFailed(dispatch, error));
        })
      .catch(error => loginUserFailed(dispatch, error));
    };
};

const loginUserSuccess = (dispatch, user, navigateTo, firstAccess, token, email) => {
  console.log('utente loggato', user);
  const { id } = firebase.auth();
  dispatch({ type: LOGIN_USER_SUCCESS, payload: user, id, token, email });
  if (firstAccess === false) {
    navigateTo('categories');
  } else {
    navigateTo('profile');
  }
};

const loginUserFailed = (dispatch, error) => {
  console.log('non sono riuscito neanche a creare un account');
  dispatch({ type: LOGIN_USER_FAIL, payload: error });
};

export const logOut = ({ navigateTo }) => {
  console.log('Siamo nella logOut action');
  return (dispatch) => {
    dispatch({ type: LOGOUT_USER_START });
    navigateTo('login');
  };
};

export const userProfile = ({ name, email, surname, born, tutorial, navigateTo, token }) => {
  const { currentUser } = firebase.auth();
  navigateTo('categories');
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile`)
      .set({ name, email, surname, born, tutorial, token })
      .then(() => dispatch({ type: CREATE_PROFILE }));
    console.log('sono su UserProfile');
  };
};

export const getUserId = () => {
  const { currentUser } = firebase.auth();
  return currentUser.uid;
};

export const getTokenId = (user) => {
  console.log('sono in getTokenId, user =', user);
  const ArrayReturn = new Array();
  firebase.database().ref(`/users/${user}/profile`)
    .on('value', snap => {
        snap.forEach((child) => {
            const valPush = child.val();
            valPush.key = child.key;
            ArrayReturn.push(valPush);
        });
      });
      return ArrayReturn[4];
};

export const getMail = (user) => {
  console.log('sono in getTokenId, user =', user);
  const ArrayReturn = new Array();
  firebase.database().ref(`/users/${user}/profile`)
    .on('value', snap => {
        snap.forEach((child) => {
            const valPush = child.val();
            valPush.key = child.key;
            ArrayReturn.push(valPush);
        });
      });
      return ArrayReturn[1];
};

export const userLoad = () => {
  console.log('carichiamo le user info da firebase');
  const { currentUser } = firebase.auth();
  console.log('currentUser', currentUser.uid);
  return (dispatch) => {
    firebase.database().ref(`/users/${currentUser.uid}/profile`)
      .on('value', snapshot => {
        dispatch({ type: LOAD_PROFILE_SUCCESS, payload: snapshot.val(), user: currentUser });
      });
  };
};

export const tutorial = async () => {
  const value = await AsyncStorage.getItem('@MySuperStore:tutorial');
  console.log('sono su tutorial action ', value);
  if (value !== 'no') {
      console.log('IF tutorial true');
      Alert.alert(
        'Tutorial',
        'vuoi mostrata una breve guida per l\'uso dell\'app?',
        [{ text: 'Si',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('@MySuperStore:tutorial', 'no');
              console.log('hai premuto si, setto off il tutorial');
              Alert.alert(
                'Come usare l\'app',
                'Questa applicazione ti permette di creare e partecipare ad eventi sportivi creati da altri utenti. In ogni schermata, in alto a destra, sarà presente un punto interrogativo, cliccalo per saperne di più sulle azioni che puoi compiere in quella pagina. Inizia da questa!',
                [{ text: 'Ho capito',
                  onPress: () => {
                    Alert.alert(
                      'Ricorda!',
                      'Puoi riattivare questa piccola guida cliccando l\'apposito tasto dalla schermata "Il tuo profilo" ',
                      [{ text: 'Ho capito' }]);
                    }
                  }]);
            } catch (error) {
                console.log('errore tutorial dopo il click si->ho capito');
              }
            }
          },
        { text: 'Non ora' },
        { text: 'Mai',
            onPress: async () => {
              try {
                await AsyncStorage.setItem('@MySuperStore:tutorial', 'no');
                Alert.alert(
                  'Ricorda!',
                  'Puoi riattivare questa piccola guida cliccando l\'apposito tasto dalla schermata "Il tuo profilo" ',
                  [{ text: 'Ho capito' }]);
              } catch (error) {
                console.log('errore set');
              }
        }
      }]);
    }
  };
