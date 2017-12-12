import { combineReducers } from 'redux';
import eventlistReducer from './eventlistReducer';
import filterReducer from './filterReducer';
import loadingReducer from './loadingReducer';
import authReducer from './authReducer';

const appReducer = combineReducers({
  eventlist: eventlistReducer,
  filter: filterReducer,
  loading: loadingReducer,
  auth: authReducer
});

export default appReducer;
