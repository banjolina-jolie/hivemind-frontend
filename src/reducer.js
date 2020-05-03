import { axiosClient } from './axios';
import ReconnectingWebSocket from 'reconnecting-websocket';

export const AUTHENTICATE_USER = 'auth-user/LOAD';
export const AUTHENTICATE_USER_SUCCESS = 'auth-user/LOAD_SUCCESS';
export const AUTHENTICATE_USER_FAIL = 'auth-user/LOAD_FAIL';

export const CREATE_USER = 'create-user/LOAD';
export const CREATE_USER_SUCCESS = 'create-user/LOAD_SUCCESS';
export const CREATE_USER_FAIL = 'create-user/LOAD_FAIL';

export const SET_QUESTION = 'question/set-question';
export const SET_NEXT_VOTING_ROUND = 'question/set-next-voting-round';

export const SET_USER = 'user/set-user';

export const SET_WEBSOCKET = 'websocket/set-websocket';

export const SET_HOME_DATA = 'home/set-home-data';

const initialState = {
  user: null,
  question: null,
  homeData: null,
  // ws: null,
};


export default function reducer(state = initialState, action) {

  switch (action.type) {
    case SET_QUESTION:
      // console.log(action.payload)
      return {
        ...state,
        question: action.payload,
      };

    case SET_USER:
      return {
        ...state,
        user: action.payload.user,
      };

    case SET_WEBSOCKET:
      return {
        ...state,
        ws: action.payload,
      };

    case SET_HOME_DATA:
      return {
        ...state,
        homeData: action.payload,
        question: action.payload.activeQuestion,
      };

    case SET_NEXT_VOTING_ROUND: {
      let winningWord = `${action.payload.winningWord}`;

      const question = { ...state.question };

      if (question) {
        if (winningWord === '(complete-answer)') {
          question.endTime = true;
        } else if (winningWord) {
          question.answer = `${question.answer} ${winningWord}`.trim();
        }
      }

      return {
        ...state,
        question,
      };
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

export function logout() {
  localStorage.removeItem('authToken');
  delete axiosClient.defaults.headers.common["Authorization"];
  return {
    type: SET_USER,
    payload: {
      user: null,
    },
  };
}

export function submitLogin(email, password) {
  return dispatch => {
    return axiosClient.post(`/auth-user`, { email, password }).then(res => {
      if (res) {
        localStorage.setItem('authToken', res.data.authToken);
        axiosClient.defaults.headers.common["Authorization"] = `Bearer ${res.data.authToken}`;
        dispatch({
          type: SET_USER,
          payload: {
            user: res.data,
          },
        });
      }
    });
  };
};

export function fetchUser() {
  return dispatch => {
    return axiosClient.get('/me').then(res => {
      if (res) {
        dispatch({
          type: SET_USER,
          payload: {
            user: res.data,
          },
        });
      }
    });
  };
}

export function fetchHomeData() {
  return dispatch => {
    return axiosClient.get('/home').then(res => {
      if (res) {
        dispatch({
          type: SET_HOME_DATA,
          payload: res.data,
        });
      }
    });
  };
}

// export function connectToWs() {
//   return dispatch => {
//     const ws = new ReconnectingWebSocket(`${wsUrl}?question=${question.id}`);
//     return {
//       dispatch({
//         type: SET_WEBSOCKET,
//         payload: ws,
//       });
//     }
//   };
// }