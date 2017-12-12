import firebase from 'firebase';
import { Alert, ToastAndroid } from 'react-native';
import {
  EVENT_CREATE,
  EVENT_EDIT,
  EVENT_DELETE,
  EVENT_DELETE_FAIL,
  EVENTLIST_FETCH_SUCCESS,
  DOWNLOAD_INITIALEVENTLIST_START,
  DOWNLOAD_INITIALEVENTLIST_SUCCESS,
  UPDATE_PATH,
  SET_VISIBILITY_FILTER,
  FOLLOW,
  ENJOY
 } from './types';

export const eventCreate = ({ title, location, duedate, navigateTo, path, slider, latitude, longitude }) => {
  const { currentUser } = firebase.auth();
  const owner = currentUser.uid;
  const subPath = path.substring(11, 20);
  let image;
  if (subPath === 'Basket') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport3.bmp?alt=media&token=63c4517d-519a-4f9e-a236-eb25299c5b22';
  } else if (subPath === 'Calcio') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport9.bmp?alt=media&token=535718fb-e8ad-49e5-be2d-1dbdbffa93df';
  } else if (subPath === 'Corsa') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport4.bmp?alt=media&token=49601643-e829-4ea3-b426-ec3749eb1527';
  } else if (subPath === 'Golf') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport11.bmp?alt=media&token=97a63ce0-242c-4f3f-99e2-f4bce828eaf1';
  } else if (subPath === 'Pallavolo') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport12.bmp?alt=media&token=e115605f-b942-45f1-8971-afa54756729f';
  } else if (subPath === 'Rugby') {
    image = 'https://firebasestorage.googleapis.com/v0/b/todolist-rn.appspot.com/o/categorie%2Fsport2.bmp?alt=media&token=07fc739c-cf85-4844-a4c8-a50585118af1';
  } else {
    image = 'https://facebook.github.io/react/img/logo_og.png';
  }
  navigateTo('categories');
  return (dispatch) => {
    firebase.database().ref(path)
      .push({ title, location, duedate, done: false, owner, partecipanti: { owner }, image, slider, latitude, longitude })
      .then(() => dispatch({ type: EVENT_CREATE }));
  };
};
///////////////////////////////////
export const eventEdit = ({ title, location, duedate, id, navigateTo, path, slider, latitude, longitude }) => {
  // console.log('Path event edit ', path);
  // console.log('id event =  ', id);
  navigateTo('categories');
  return (dispatch) => {
    firebase.database().ref(`${path}/${id}`)
      .update({ title, location, duedate, slider, latitude, longitude })
      .then(() => dispatch({ type: EVENT_EDIT }));
  };
};

export const eventDelete = (eventId, path, user) => {
  const messaggio = ('Evento cancellato con successo', eventId);
  const messaggio2 = ('Evento NON cancellato', eventId);
  const messaggio3 = 'Un evento a cui stavi partecipando è stato cancellato. Categoria:';
  //console.log('path', path);
  //console.log('In eventDelete', eventId);
  notifyPartecipanti(path, messaggio3, eventId);
  return (dispatch) => {
    const ref = firebase.database().ref(`${path}/${eventId}/owner`);
    ref.once('value')
      .then((snapshot) => {
        const key = snapshot.val(); // "event"
        if (key === user) {
          // console.log('restituisco true');
          firebase.database().ref(`${path}/${eventId}`).remove()
             .then(() => {
               dispatch({ type: EVENT_DELETE, messaggio, flag: true });
             });
        } else {
          Alert.alert(
            'Avviso',
            'Non puoi eliminare gli eventi di altri utenti',
            [{ text: 'Ho capito', style: 'cancel' }]);
        // console.log('restituisco false');
        return dispatch({ type: EVENT_DELETE_FAIL, messaggio2, flag: false });
      }
      });
  };
};
/////////////////////////////////////////////////////

export const eventlistFetch = (path) => {
  console.log('carichiamo le event da firebase');
  console.log('la path scelta da eventlistFetch è ', path);
  return (dispatch) => {
    dispatch({ type: DOWNLOAD_INITIALEVENTLIST_START });
    firebase.database().ref(path)
      .on('value', snapshot => {
        dispatch({ type: EVENTLIST_FETCH_SUCCESS, payload: snapshot.val() });
        dispatch({ type: DOWNLOAD_INITIALEVENTLIST_SUCCESS });
      });
  };
};

export const updatePath = (path) => {
  return (dispatch) => {
    dispatch({ type: UPDATE_PATH, payload: path });
  };
};

export const setVisibilityFilter = filter => {
	return { type: SET_VISIBILITY_FILTER, filter };
};

export const follow = (link, tokenUser, email) => {
  let flag = false;
  const ArrayReturn = new Array();
  const subPath = link.substring(11, 20);
  // console.log('subPath follow', subPath);
  // console.log('token cell ', tokenUser);
  firebase.database().ref(`Categorie/Lista/${subPath}/Followers`)
  .on('value', snap => {
      snap.forEach((child) => {
          const valPush = child.val();
          valPush.key = child.key;
          ArrayReturn.push(valPush);
      });
    });
    // console.log('Array scaricato da followList');
    for (let i = 1; i < ArrayReturn.length; i++) {
      console.log(ArrayReturn[i].tokenUser);
      if (ArrayReturn[i].tokenUser === tokenUser) {
          firebase.database().ref(`Categorie/Lista/${subPath}/Followers/${ArrayReturn[i].key}`).remove();
          ToastAndroid.show('Hai rimosso questa categoria dai preferiti.', ToastAndroid.SHORT, ToastAndroid.CENTER);
          flag = true;
          break;
      }
    }
  if (!flag) {
      firebase.database().ref(`Categorie/Lista/${subPath}/Followers`)
        .push({ tokenUser, email });
        ToastAndroid.show('Hai aggiunto questa categoria ai preferiti.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
    return (dispatch) => dispatch({ type: FOLLOW, payload: tokenUser });
};

export const enjoy = ({ user, email, tokenUser, id, path, navigateTo }) => {
  const subPath = path.substring(11, 20);
  firebase.database().ref(`Categorie/${subPath}/${id}/partecipanti`)
    .push({ tokenUser, email });
  ToastAndroid.show('participazione effettuata.', ToastAndroid.SHORT, ToastAndroid.CENTER);
  navigateTo('categories');
  return (dispatch) => dispatch({ type: ENJOY, payload: tokenUser });
};

export const notEnjoy = ({ user, tokenUser, id, path, navigateTo }) => {
  console.log('sono su notEnjoy per rimuovere ', user);
  const ArrayReturn = new Array();
  const subPath = path.substring(11, 20);
  firebase.database().ref(`Categorie/${subPath}/${id}/partecipanti`)
    .on('value', snap => {
        snap.forEach((child) => {
            const valPush = child.val();
            valPush.key = child.key;
            ArrayReturn.push(valPush);
        });
      });
      console.log('Array scaricato da enjoy ', ArrayReturn);
      for (let i = 0; i < ArrayReturn.length; i++) {
        if (ArrayReturn[i].tokenUser === tokenUser) {
            firebase.database().ref(`Categorie/${subPath}/${id}/partecipanti/${ArrayReturn[i].key}`).remove();
      // console.log('enjoy - ArrayReturn ', ArrayReturn[i].tokenUser);
      // console.log('enjoy - tokenUser ', tokenUser);
    }
  }
    ToastAndroid.show('Hai rimosso la tua partecipazione.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    navigateTo('categories');
    return (dispatch) => dispatch({ type: ENJOY, payload: tokenUser });
};

export const Notifica = (token, msg) => {
  console.log('invio una notifica a: ', token);
  fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    // headers: {
    //   Accept: 'application/json',
    //   'Content-Type': 'application/json',
    //   'accept-encoding': 'gzip, deflate'
    // },
    body: JSON.stringify([{
      title: 'Sport Buddy Finder',
      to: token,
      sound: 'default',
      body: msg,
      data: { title: 'DATA' }
    }]),
  });
};

export const notifyFollowers = ({ path, msg }) => {
  const ArrayReturn = new Array();
  const subPath = path.substring(11, 20);
  const text = `${msg} ${subPath}`;
    firebase.database().ref(`Categorie/Lista/${subPath}/Followers`)
      .on('value', snap => {
          snap.forEach((child) => {
              const valPush = child.val();
              valPush.key = child.key;
              ArrayReturn.push(valPush);
          });
        });
    for (let i = 1; i < ArrayReturn.length; i++) {
      Notifica(ArrayReturn[i].tokenUser, text);
    }
};

export const notifyPartecipanti = ({ path, msg, idEvent }) => {
  const ArrayReturn = new Array();
  const text = `${msg} ${path}`;
    firebase.database().ref(`Categorie/${path}/${idEvent}/partecipanti`)
      .on('value', snap => {
          snap.forEach((child) => {
              const valPush = child.val();
              valPush.key = child.key;
              ArrayReturn.push(valPush);
          });
        });
    for (let i = 1; i < ArrayReturn.length; i++) {
      Notifica(ArrayReturn[i].tokenUser, text);
    }
};

export const contaPartecipanti = (path, idEvent) => {
  const ArrayReturn = new Array();
  const subPath = path.substring(11, 20);
  // console.log('subpath ', subPath);
    firebase.database().ref(`Categorie/${subPath}/${idEvent}/partecipanti`)
      .on('value', snap => {
          snap.forEach((child) => {
              const valPush = child.val();
              valPush.key = child.key;
              ArrayReturn.push(valPush);
          });
        });
    return ArrayReturn.length;
};

export const doYouFollow = (tokenUser, path) => {
const ArrayReturn = new Array();
  firebase.database().ref(`Categorie/Lista/${path}/Followers`)
    .on('value', snap => {
        snap.forEach((child) => {
            const valPush = child.val();
            valPush.key = child.key;
            ArrayReturn.push(valPush);
        });
      });
    for (let i = 1; i < ArrayReturn.length; i++) {
      if (ArrayReturn[i].tokenUser === tokenUser) {
        return true;
      }
    }
    return false;
};

export const doYouEnjoyed = (path, idEvent, email) => {
  // console.log('sono su doYouEnjoyed');
  // console.log('path', path);
  // console.log('idEvent ', idEvent);
  // console.log('email', email);
  const ArrayReturn = new Array();
  const subPath = path.substring(11, 20);
  // console.log('subpath ', subPath);
    firebase.database().ref(`Categorie/${subPath}/${idEvent}/partecipanti`)
      .on('value', snap => {
          snap.forEach((child) => {
              const valPush = child.val();
              valPush.key = child.key;
              ArrayReturn.push(valPush);
          });
        });
        for (let i = 0; i < ArrayReturn.length; i++) {
          if (ArrayReturn[i].email === email) {
            console.log('doYouEnjoyed yes ', email);
            console.log('nell\'array ', ArrayReturn[i].email);
            return true;
          }
          console.log('doYouEnjoyed no ', email);
          console.log('nell\'array ', ArrayReturn[i].email);
        }
        return false;
};
