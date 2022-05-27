export const addTest = (test) => ({
  type: 'ADD_TEST',
  payload: test,
});

export const addUser = (user) => ({
  type: 'ADD_USER',
  payload: user,
});

export const updateScore = (score, quantifyAnswer) => ({
  type: 'UPDATE_SCORE',
  payload: {
    score,
    quantifyAnswer,
  },
});
