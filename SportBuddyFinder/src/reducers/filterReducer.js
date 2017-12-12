import { SET_VISIBILITY_FILTER } from '../actions/types';

const initialState = 'SHOW_ACTIVE';

export default function filterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}
