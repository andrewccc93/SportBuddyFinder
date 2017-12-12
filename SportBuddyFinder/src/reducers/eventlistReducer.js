import {
  EVENT_CREATE,
  EVENT_EDIT,
  EVENT_DELETE,
  EVENT_DELETE_FAIL,
  TOGGLE_EVENT,
  DOWNLOAD_INITIALEVENTLIST,
  EVENTLIST_FETCH_SUCCESS,
  FOLLOW,
  ENJOY
} from '../actions/types';

const initialState = [];

export default function eventlistReducer(state = initialState, action) {
  switch (action.type) {
    case EVENT_CREATE:
      console.log('CASE event create');
      return state.concat({
        title: action.title,
        id: action.id,
        location: action.location,
        date: action.duedate,
        done: false,
        owner: action.currentUser,
        image: action.image,
        slider: action.slider,
        latitude: action.latitude,
        longitude: action.longitude
      });
      case EVENT_EDIT:
        console.log('CASE event edit');
        return state.concat({
          title: action.title,
          id: action.id,
          location: action.location,
          date: action.duedate,
      });
    case EVENT_DELETE:
      console.log('CASE event delete');
      console.log(action.messaggio);
      return state.concat({
        flag: action.flag,
      });
    case EVENT_DELETE_FAIL:
      console.log('CASE event delete fail');
      console.log(action.messaggio2);
      return state.concat({
        flag: action.flag,
    });
    case TOGGLE_EVENT:
      return state.map(event => {
        if (event.id === action.id) {
          return Object.assign({}, event, { done: !event.done });
        }
        return event;
      }
      );
    case DOWNLOAD_INITIALEVENTLIST:
      return action.payload;
    case EVENTLIST_FETCH_SUCCESS:
      return action.payload;
    case FOLLOW: {
      console.log('è stato inserito il token', action.payload);
      return { ...state };
    }
    case ENJOY: {
      console.log('è stato inserito il token', action.payload);
      return { ...state };
    }
    default:
      return state;
  }
}
