import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { stringify } from 'qs';
import { useUserStore } from '@/store';

export interface ResultData<T> {
  code: number;
  data: T;
  msg: string;
}

const { VITE_APP_AXIOS_TIMEOUT, VITE_APP_BASE_URL } = import.meta.env;

// 创建axios实例
const service = axios.create({
  baseURL: VITE_APP_BASE_URL,
  paramsSerializer: {
    encode: (params) => {
      // get 请求添加时间戳  防止缓存
      params.client = 'web';
      params.timestamp = new Date().getTime();
      return stringify(params, { arrayFormat: 'brackets' });
    }
  },
  timeout: parseInt(VITE_APP_AXIOS_TIMEOUT || 0)
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { getToken } = useUserStore();

    // header 中添加 token
    config.headers.token = getToken() || '';

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    if (res.code === 401) {
      const errorText = '您已登出，请登录后进行操作！';
      ElMessage.warning(errorText);
      return Promise.reject(new Error(errorText));
    }

    if (res.code !== 0) {
      // 服务端返回错误提示就展示 否则展示
      ElMessage.error(res.msg || '非常抱歉，遇到了一些错误！');
      return Promise.reject(new Error(res.msg || 'error'));
    }

    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
