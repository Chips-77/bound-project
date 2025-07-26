import request from '@/utils/request';

// 创建入库单
export const createInOrder = (data) => {
  return request.post('/api/inbound', data);
};

// 获取入库单历史
export const getInOrderHistory = (params) => {
  return request.get('/api/inbound/history', { params });
};
