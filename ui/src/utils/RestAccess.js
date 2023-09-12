import axios from 'axios';

// const customAxios = axios.create({baseURL: "http://192.168.0.192/api"});
const customAxios = axios.create({baseURL: "http://localhost/api"});

export async function get(url, options = {}) {
  return customAxios.get(url, {
    ...options,
    withCredentials: true
  }).catch((error) => {
    if (error.response) {
      // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      // リクエストは行われましたが、応答がありませんでした
      // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
      // Node.js では http.ClientRequest のインスタンスになります。
      console.log(error.request);
    } else {
      // エラーをトリガーしたリクエストの設定中に何かが発生しました
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
      // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      // リクエストは行われましたが、応答がありませんでした
      // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
      // Node.js では http.ClientRequest のインスタンスになります。
      console.log(error.request);
    } else {
      // エラーをトリガーしたリクエストの設定中に何かが発生しました
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
      // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      // リクエストは行われましたが、応答がありませんでした
      // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
      // Node.js では http.ClientRequest のインスタンスになります。
      console.log(error.request);
    } else {
      // エラーをトリガーしたリクエストの設定中に何かが発生しました
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
      // リクエストが行われ、サーバーは 2xx の範囲から外れるステータスコードで応答しました
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return error.response;
    } else if (error.request) {
      // リクエストは行われましたが、応答がありませんでした
      // `error.request` は、ブラウザでは XMLHttpRequest のインスタンスになり、
      // Node.js では http.ClientRequest のインスタンスになります。
      console.log(error.request);
    } else {
      // エラーをトリガーしたリクエストの設定中に何かが発生しました
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
}