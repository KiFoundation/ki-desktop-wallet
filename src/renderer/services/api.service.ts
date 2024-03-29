import Axios from 'axios';
import queryString from 'query-string';
import config from '@helpers/config';
const CancelToken = Axios.CancelToken;

export class ApiService {
  static token = '';
  options: any = {};

  static setToken(token: string) {
    ApiService.token = token;
  }

  constructor() {
    this.options = {
      baseURL: config.kichain.nodeUrl,
    };
  }

  async get(url: string, query?: object) {
    url = (query && `${url}?${queryString.stringify(query)}`) || url;

    return this.call({
      url,
    });
  }

  async post(url: string, data: object) {
    return this.call({
      data,
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  async postWithProgress(url, data, onUploadProgress, onCancelPost) {
    return this.call({
      data,
      method: 'POST',
      onUploadProgress,
      url,
      ...(onCancelPost && { cancelToken: new CancelToken(onCancelPost) }),
    });
  }

  async put(url, data, onUploadProgress, onCancelPost) {
    return this.call({
      data,
      method: 'PUT',
      url,
      ...(onUploadProgress && onUploadProgress),
      ...(onCancelPost && { cancelToken: new CancelToken(onCancelPost) }),
    });
  }

  async delete(url) {
    return this.call({
      method: 'DELETE',
      url,
    });
  }

  async call(config) {
    config.url = this.options.baseURL + config.url;
    if (ApiService.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + ApiService.token;
    }
    return Axios.request(config);
  }

  async unserialize(req, messageType) {
    const res = await req;

    return this.castObjectToProtoMessage(res.data, messageType);
  }

  handleError(error) {
    const response = error.response && error.response.data;
    const errors = response && response.errors;
    return (errors && errors.length > 0 && errors[0].message.toUpperCase()) || '';
  }

  castObjectToProtoMessage(obj, messageType) {
    const err = messageType.verify(obj);

    if (err && !err.includes('enum value expected')) {
      // we exclude "enum error" because verify is currently (stupidly) stricter than fromObject
      throw new Error(`JSON was not compatible with message ${messageType.name} (${err}).`);
    }

    return messageType.fromObject(obj);
  }
}
