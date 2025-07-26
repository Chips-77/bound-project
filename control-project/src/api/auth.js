import request from '@/utils/request';

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {boolean} data.rememberMe - 是否记住我
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  });
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  });
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/api/auth/userInfo',
    method: 'get'
  });
}
