import _ from 'lodash';
import axios from 'axios';
// import axiosMiddleware from 'redux-axios-middleware';
import { camelCase, snakeCase } from 'change-case';


export const axiosClient = axios.create({
  // baseURL: 'http://localhost:3001',
  baseURL: 'https://hivemind-rails.herokuapp.com',
  responseType: 'json',
  transformRequest: [function (data, headers) {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      headers.common["Authorization"] = `Bearer ${authToken}`;
    }
    snakeCaseizeKeys(data);
    return JSON.stringify(data);
  }],
  transformResponse: [function (data) {
    camelizeKeys(data);
    return data;
  }],
});

// axiosClient.interceptors.request.use(async (request) => {
//   // request.headers.common.Authorization = `Bearer ${token}`;
//   return request;
// }, (error) => {
//   // Do something with request error
//   return error;
// });

// axiosClient.interceptors.response.use(async (response) => {
//   return Promise.resolve(response);
// }, async (error) => {
//   return Promise.reject(error);
// });

function camelizeKeys(obj) {
  if (_.isPlainObject(obj)) {
    for (const key in obj) {
      const val = obj[key];
      const camelizedKey = camelCase(key);
      obj[camelizedKey] = val;
      if (camelizedKey !== key) {
        delete obj[key];
      }
      camelizeKeys(val);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((o) => camelizeKeys(o));
  }
}

function snakeCaseizeKeys(obj) {
  if (_.isPlainObject(obj)) {
    for (const key in obj) {
      const val = obj[key];
      const snakeCaseizedKey = snakeCase(key);
      obj[snakeCaseizedKey] = val;
      if (snakeCaseizedKey !== key) {
        delete obj[key];
      }
      snakeCaseizeKeys(val);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((o) => snakeCaseizeKeys(o));
  }
}

// export default axiosMiddleware(axiosClient);
