import axios from 'axios';

const customAxios = axios.create({baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT});

export async function get(url, options = {}) {
  return customAxios.get(url, {
    ...options,
    withCredentials: true
  }).catch((error) => {
    if (error.response) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
}

export async function post(url, data = {}, options = {}) {
  return customAxios.post(url, {
    ...data
  }, {
    ...options,
    withCredentials: true
  }).catch((error) => {
    if (error.response) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  })
}

export async function put(url, data = {}, options = {}) {
  return customAxios.put(url, {
    ...data
  }, {
    ...options,
    withCredentials: true
  }).catch((error) => {
    if (error.response) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
}

export async function del(url, options = {}) {
  return customAxios.delete(url, {
    ...options,
    withCredentials: true
  }).catch((error) => {
    if (error.response) {
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
}