import { axiosClient } from './axios';
import ReconnectingWebSocket from 'reconnecting-websocket';

export const AUTHENTICATE_USER = 'auth-user/LOAD';
export const AUTHENTICATE_USER_SUCCESS = 'auth-user/LOAD_SUCCESS';
export const AUTHENTICATE_USER_FAIL = 'auth-user/LOAD_FAIL';

export const CREATE_USER = 'create-user/LOAD';
export const CREATE_USER_SUCCESS = 'create-user/LOAD_SUCCESS';
export const CREATE_USER_FAIL = 'create-user/LOAD_FAIL';

export const SET_EDIT_QUESTION = 'question/set-edit-question';
export const SET_NEXT_VOTING_ROUND = 'question/set-next-voting-round';
export const SET_ACTIVE_HIVE_COUNT = 'websocket/set-active-hive-count';

export const SET_USER = 'user/set-user';

export const SET_WEBSOCKET = 'websocket/set-websocket';



export const SET_HOME_DATA = 'home/set-home-data';

const initialState = {
  user: null,
  activeQuestion: null,
  editQuestion: null,
  homeData: null,
  activeHiveCount: 0,
  // ws: null,
};


export default function reducer(state = initialState, action) {

  switch (action.type) {
    case SET_EDIT_QUESTION:
      return {
        ...state,
        editQuestion: action.payload,
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

    case SET_ACTIVE_HIVE_COUNT:
      return {
        ...state,
        activeHiveCount: Number(action.payload.count),
      }

    case SET_HOME_DATA:
      return {
        ...state,
        previousQuestions: action.payload.previousQuestions,
        activeQuestion: action.payload.activeQuestion,
      };

    case SET_NEXT_VOTING_ROUND: {
      let winningWord = `${action.payload.winningWord}`;

      const activeQuestion = { ...state.activeQuestion };

      if (activeQuestion) {
        if (winningWord === '(complete-answer)') {
          activeQuestion.endTime = true;
        } else if (winningWord) {
          activeQuestion.answer = `${activeQuestion.answer} ${winningWord}`.trim();
        }
      }

      return {
        ...state,
        activeQuestion,
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
    if (questionId === 'new') {
      dispatch({
        type: SET_EDIT_QUESTION,
        payload: {},
      });
      return Promise.resolve();
    }
    return axiosClient.get(`/question/${questionId}`).then(res => {
      if (res) {
        dispatch({
          type: SET_EDIT_QUESTION,
          payload: res.data,
        });
      }
    });
  };
}

export function saveQuestion(question) {
  return dispatch => {
    const reqMethod = question.id ? 'put' : 'post';
    const reqUrl = question.id ? `/question/${question.id}` : '/questions';
    return axiosClient[reqMethod](reqUrl, question).then(res => {
      if (res) {
        dispatch({
          type: SET_EDIT_QUESTION,
          payload: res.data,
        });
        return res;
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

export function setActiveHiveCount(count) {
  return {
    type: SET_ACTIVE_HIVE_COUNT,
    payload: {
      count,
    },
  }
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