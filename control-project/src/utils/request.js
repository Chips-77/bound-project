// src/utils/api.js
import axios from 'axios';
import { messageManager } from '@/utils/messageManager';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：添加认证信息（如 Token）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Request Method:', config.method);
    console.log('Request URL:', config.baseURL + config.url);
    console.log('Request Headers:', config.headers);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
api.interceptors.response.use(
  (response) => {
    // code200时成功
    if (response.data.code !== 200) {
      messageManager.error(response.data.message || '请求失败');
      return Promise.reject(response.data);
    }
    return response.data; // 只返回数据部分
  },
  (error) => {
    // 网络错误、超时等
    messageManager.error('网络异常，请稍后再试');
    return Promise.reject(error);
  }
);

export default api;
