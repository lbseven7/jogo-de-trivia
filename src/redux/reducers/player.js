const INITIAL_STATE = {
  name: '',
  assertions: '',
  score: 0,
  gravatarEmail: '',
};

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case 'ADD_USER':
    return { ...state, ...action.payload };
  case 'UPDATE_SCORE':
    return { ...state, score: action.payload };
  default:
    return state;
  }
};

export default playerReducer;
