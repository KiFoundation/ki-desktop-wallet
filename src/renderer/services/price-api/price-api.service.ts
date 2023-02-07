import Axios, { AxiosRequestConfig, Canceler } from 'axios';
import queryString from 'query-string';
import config from '@helpers/config';
const CancelToken = Axios.CancelToken;

export class PriceApiService {
  static token = '';
  options: any = {};
  static setToken(token: string) {
    PriceApiService.token = token;
  }

  constructor() {
    this.options = {
      baseURL: config.kichain.priceUrl,
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

  async postWithProgress(
    url: string,
    data: object,
    onUploadProgress?: (progressEvent: any) => void,
    onCancelPost?: (cancel: Canceler) => void
  ) {
    return this.call({
      data,
      method: 'POST',
      url,
      ...(onUploadProgress && onUploadProgress),
      ...(onCancelPost && { cancelToken: new CancelToken(onCancelPost) }),
    } as AxiosRequestConfig);
  }

  async put(
    url: string,
    data: object,
    onUploadProgress?: (progressEvent: any) => void,
    onCancelPost?: (cancel: Canceler) => void
  ) {
    return this.call({
      data,
      method: 'PUT',
      url,
      ...(onUploadProgress && onUploadProgress),
      ...(onCancelPost && { cancelToken: new CancelToken(onCancelPost) }),
    });
  }

  async delete(url: string) {
    return this.call({
      method: 'DELETE',
      url,
    });
  }

  async call(config: AxiosRequestConfig) {
    config.url = this.options.baseURL + config.url;
    if (PriceApiService.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + PriceApiService.token;
    }
    return Axios.request(config);
  }

  handleError(error: any) {
    const response = error.response && error.response.data;
    const errors = response && response.errors;
    return (errors && errors.length > 0 && errors[0].message.toUpperCase()) || '';
  }
}
