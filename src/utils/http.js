import { HOST } from './env';

/**
 * Helper to add headers including optional Bearer token
 */
const buildHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('squidToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Get api request
 * @param {*} url API endpoint
 * @returns Promise of the result or error
 */
export const get = async (url) =>
  new Promise((resolve, reject) => {
    fetch(HOST + url, {
      method: 'GET',
      headers: buildHeaders(),
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          // Optionally redirect to login
          localStorage.removeItem('squidToken');
          window.location.href = '/login';
        }
        return response.json();
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

/**
 * HTTP Post request
 * @param {*} url API end point
 * @param {*} payload payload of the post request
 * @returns Promise of the result or error
 */
export const post = async (url, payload) =>
  new Promise((resolve, reject) => {
    fetch(HOST + url, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          // Optionally redirect to login
          localStorage.removeItem('squidToken');
          window.location.href = '/login';
        }
        return response.json();
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

/**
 * HTTP Post request
 * @param {*} url API end point
 * @param {*} payload payload of the post request
 * @returns Promise of the result or error
 */
export const deleteMethode = async (url, payload) =>
  new Promise((resolve, reject) => {
    fetch(HOST + url, {
      method: 'DELETE',
      headers: buildHeaders(),
    })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          // Optionally redirect to login
          localStorage.removeItem('squidToken');
          window.location.href = '/login';
        }
        return response.json();
      })
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

export const http = {
  get,
  post,
  deleteMethode,
};
