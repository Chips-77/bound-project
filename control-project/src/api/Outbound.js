import request from '@/utils/request';

// 创建出库单
export const createOutOrder = (data) => {
  return request.post('/api/outbound', data);
};

// 删除库存记录

export const deleteInventory = (id) => {
  return request.delete(`/api/inventory/${id}`);
};

// 获取出库单历史
export const getOutOrderHistory = (params) => {
  return request.get('/api/outbound/history', { params });
};
