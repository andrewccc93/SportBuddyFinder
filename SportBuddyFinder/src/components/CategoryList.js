import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Alert } from 'react-native';
import Event from './Event';
import { Spinner } from './common';
import { updatePath, increment, follow } from '../actions/EventActions';
import { userLoad, tutorial } from '../actions/AuthActions';

let pathLocale = '';
class CategoryList extends Component {

  async componentWillMount() {
    this.props.userLoad();
    this.props.updatePath('/Categorie/Lista');
    pathLocale = '/Categorie/Lista';
    console.log('monto CategoryList');
    console.log('il path da CategoryList è', this.props.path);
    this.props.eventlistFetch(pathLocale);
    this.createDataSource(this.props);
    this.props.tutorial();
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);
  }

  createDataSource({ eventlist }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(eventlist);
  }

  followList(listaEvent) {
      Alert.alert(
        'Aggiungi/Rimuovi ai preferiti',
        'Sei sicuro?',
        [
          { text: 'Annulla', style: 'cancel' },
          { text: 'Si',
            onPress: () => {
              console.log('cambia il follow state');
              console.log('item link ', listaEvent.link);
              console.log('token', this.props.token);
              console.log('email ', this.props.email);
              this.props.follow(listaEvent.link, this.props.token, this.props.email);
            }
          }
        ]
      );
      this.props.updatePath('/Categorie/Lista');
    }

    renderRow(listaEvent) {
      return (
        <Event
          item={listaEvent}
          onLongPress={() => this.followList(listaEvent)} //lista eventi
          onClick={() => {
            this.props.onClick(listaEvent, listaEvent.link);
            this.props.updatePath(listaEvent.link);
            console.log('il link da CategoryList è', listaEvent.link);
            console.log('il path da CategoryList dopo il click è', this.props.path);
          }}
          onToggle={() => {
            console.log('onToggle');
          }}
        />);
}

  render() {
    if (this.props.isLoading) {
      return <Spinner />;
    }
    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}

const mapStateToProps = state => ({
  path: state.auth.path,
  pathPrev: state.auth.pathPrev,
  cont: state.auth.cont,
  token: state.auth.token,
  email: state.auth.email
});

export default connect(mapStateToProps, { updatePath, increment, userLoad, tutorial, follow })(CategoryList);
