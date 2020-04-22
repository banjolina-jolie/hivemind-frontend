import { axiosClient } from './axios';


export const AUTHENTICATE_USER = 'auth-user/LOAD';
export const AUTHENTICATE_USER_SUCCESS = 'auth-user/LOAD_SUCCESS';
export const AUTHENTICATE_USER_FAIL = 'auth-user/LOAD_FAIL';

export const CREATE_USER = 'create-user/LOAD';
export const CREATE_USER_SUCCESS = 'create-user/LOAD_SUCCESS';
export const CREATE_USER_FAIL = 'create-user/LOAD_FAIL';

export const SET_QUESTION = 'question/set-question';
export const SET_NEXT_VOTING_ROUND = 'question/set-next-voting-round';

const initialState = {
  user: {name: 'Dylan'},
  question: null,
};


export default function reducer(state = initialState, action) {

  switch (action.type) {
    case SET_QUESTION:
      return {
        ...state,
        question: action.payload,
      };

    case SET_NEXT_VOTING_ROUND:
      return {
        ...state,
        question: {
          ...state.question,
          answer: `${state.question.answer} ${action.payload.winningWord}`
        }
      }

    case CREATE_USER:
      return { ...state, user: action.payload.data };

    default:
      return state;
  }
}

export function createUser(data) {
  return {
    type: CREATE_USER,
    payload: {
      request: {
        url: '/users',
        method: 'POST',
        data,
      },
    },
  };
}

export function fetchQuestion(questionId) {
  return dispatch => {
    return axiosClient.get(`/question/${questionId}`).then(res => {
      if (res) {
        dispatch({
          type: SET_QUESTION,
          payload: res.data,
        });
      }
    });
  };
}

export function setNextVotingRound(winningWord) {
  return {
    type: SET_NEXT_VOTING_ROUND,
    payload: {
      winningWord,
    },
  }
}
