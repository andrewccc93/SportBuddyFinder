import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView, Alert } from 'react-native';
import Event from './Event';
import { Spinner } from './common';
import { updatePath, increment, goToEnjoy } from '../actions/EventActions';

let path = '';
let pathLocale = '';

class Eventlist2 extends Component {
  componentWillMount() {
    pathLocale = this.props.path;
    console.log('monto Eventlist2');
    console.log('il path da eventlist2 è', this.props.path);
    this.props.eventlistFetch(pathLocale);
    //this.props.updatePath(path);
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillreceiveProps");
    this.createDataSource(nextProps);
  }

  createDataSource({ eventlist }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(eventlist);
  }

   deleteEvent(event) {
    Alert.alert(
        'Delete event',
        'Are you sure?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Yes',
            onPress: () => {
              this.props.delete(event, pathLocale, this.props.user);
          }
        }]);
    }

    renderRow(event) {
      return (
        <Event
          item={event}
          onLongPress={() => this.deleteEvent(event.id)}
          onClick={() => {
            this.props.onClick(event);
            path = event.link;
            console.log('If eventlist', this.props.pathPrev);
            console.log('path = ', path);
            console.log('pathLocale = ', pathLocale);
            console.log('event id = ', event.id);
            if (path === null) {
              // console.log('if then');
              this.props.updatePath(pathLocale);
            } else {
              // console.log('if else');
              this.props.updatePath(path);
            }
            //if (this.props.pathPrev === '/Categorie/Lista') {
            //}
            console.log('il link da eventlist2 è', event.link);
            console.log('il path da eventlist2 dopo il click è', this.props.path);
          }}
          onToggle={() => {
            console.log('onToggle');
            // const navigateTo = (screen) => this.props.navigation.navigate(screen);
            // this.props.goToEnjoy(navigateTo);
          }}
        />); //this.props.toggleEvent(event)}
}

  render() {
    // console.log(this.props);
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
  user: state.auth.user,
  path: state.auth.path,
  pathPrev: state.auth.pathPrev,
  cont: state.auth.cont
});

export default connect(mapStateToProps, { updatePath, increment, goToEnjoy })(Eventlist2);

//export default Eventlist2;
