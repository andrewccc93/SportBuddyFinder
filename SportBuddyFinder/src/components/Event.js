import React from 'react';
// import { connect } from 'react-redux';
// import Expo, { Notifications } from 'expo';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserId, getTokenId, getMail } from '../actions/AuthActions';
import { doYouFollow, contaPartecipanti, doYouEnjoyed } from '../actions/EventActions';

const Event = ({ item, onClick, onToggle, onLongPress }) => {
  const isDone = { textDecorationLine: item.done ? 'line-through' : 'none' };
  const user = getUserId();
  const token = getTokenId(user);
  const email = getMail(user);
  let partecipanti = -1;
  let textPartecipanti;
  let isFollowed = { color: 'white' };
  let isMine = { borderColor: 'black' };
  let isFull;
  let enjoyed;

  if (item.owner === user) {
    isMine = { borderColor: 'blue' };
  }

const categorie = {
  0: 'Basket',
  1: 'Calcio',
  2: 'Corsa',
  3: 'Golf',
  4: 'Pallavolo',
  5: 'Rugby'
};

for (let i = 0; i < 6; i++) {
  const x = contaPartecipanti(`/Categorie/${categorie[i]}`, item.id);
  if (x !== 0) {
    partecipanti = x;
    break;
  }
}

if (item.slider < 51) {
  textPartecipanti = `Partecipanti: ${partecipanti} / ${item.slider}`;
} else {
  textPartecipanti = `Partecipanti: ${partecipanti} / infinito`;
}


if (partecipanti === item.slider) {
  isFull = { color: 'red' };
} else {
  isFull = { color: 'black' };
}

 for (let i = 0; i < 6; i++) {
    if (item.title === categorie[i]) {
      textPartecipanti = '';
      if (doYouFollow(token, categorie[i])) {
        isFollowed = { color: 'blue' };
        // console.log('doYouFollow true da event');
      } else {
        // console.log('doYouFollow false da event');
        isFollowed = { color: 'white' };
      }
    } else {
        const flag = doYouEnjoyed(`CategorieXX${categorie[i]}`, item.id, email);
        if (flag) {
          enjoyed = { borderColor: 'green' };
          break;
        }
      }
    }

  return (
    <TouchableOpacity
      style={[styles.wrapper, isMine, enjoyed]}
      onPress={onClick}
      onLongPress={onLongPress}
    >
      <Image
          source={{
            uri: item.image || 'https://facebook.github.io/react/img/logo_og.png'
          }}
          style={styles.image}
      />
      <Text style={[styles.text, isDone]}>
        {item.title}
      </Text>
      <MaterialIcons
        name="star"
        size={40}
        style={[{ position: 'absolute', right: 20 }, isFollowed]}
      />
    <View style={{ flexDirection: 'column' }}>
      <Text style={[styles.text, isDone, { fontSize: 10 }]}>
          {item.duedate}
      </Text>
      <Text style={[styles.text, isDone, isFull, { fontSize: 10 }]}>
          {textPartecipanti}
      </Text>
    </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    //marginRight: 30,
    textAlign: 'center',
    flex: 1,
    // marginLeft: 50,
    // borderWidth: 1,
    // borderColor: 'black'
  },
  image: {
    marginLeft: 10,
    height: 50,
    width: 50,
    borderRadius: 25
  },
  wrapper: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'black'
  },
  wrapperBlue: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: 'blue'
  }
});

export default Event;
