import {
  LOGIN_USER_START,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER_START,
  LOAD_PROFILE_START,
  LOAD_PROFILE_SUCCESS,
  UPDATE_PATH,
  INCREMENT,
} from '../actions/types';


const initialState = {
  email: '',
  user: null,
  name: '',
  surname: '',
  //image: 'https://facebook.github.io/react/img/logo_og.png',
  born: '',
  error: '',
  loading: false,
  path: '/Categorie/Lista',
  pathPrev: '',
  cont: -1,
  id: '',
  token: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER_START:
      return { ...state, loading: true, error: '' };
    case LOGIN_USER_SUCCESS:
      return { ...state, loading: false, user: action.payload, error: '', id: action.id, token: action.token, email: action.email };
    case LOGIN_USER_FAIL:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT_USER_START:
      return {
              user: null,
              name: '',
              surname: '',
              born: '',
              error: '',
              loading: false,
              path: '/Categorie/Lista',
              pathPrev: '',
              cont: -1
            };
    case LOAD_PROFILE_START:
      return { ...state, loading: true };
    case LOAD_PROFILE_SUCCESS:
      console.log('sono su LOAD_PROFILE_SUCCESS');
      console.log('id', action.user.uid);
      return {
        ...state,
        loading: false,
        user: action.user.uid,
        name: action.payload.name,
        surname: action.payload.surname,
        born: action.payload.born,
        //image: action.payload.fakeImage,
      };
    case INCREMENT:
      console.log('incremento cont');
      return { ...state, cont: action.payload };
    case UPDATE_PATH:
      console.log('sono in updatePath. pathprev', state.path);
      console.log('sono in updatePath. newPath', action.payload);
      return { ...state, pathPrev: state.path, path: action.payload };
    default:
      return state;
  }
};
