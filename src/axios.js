import _ from 'lodash';
import axios from 'axios';
import { camelCase, snakeCase } from 'change-case';


export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
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
