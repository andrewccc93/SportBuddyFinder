import {
  DOWNLOAD_INITIALEVENTLIST_START,
  DOWNLOAD_INITIALEVENTLIST_SUCCESS,
} from '../actions/types';

const initialState = 'false';

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case DOWNLOAD_INITIALEVENTLIST_START:
      return true;
    case DOWNLOAD_INITIALEVENTLIST_SUCCESS:
      return false;
    default:
      return state;
  }
}
