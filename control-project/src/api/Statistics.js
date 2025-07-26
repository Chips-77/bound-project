import request from '@/utils/request';

// 查询库存列表
export const queryInventory = (params) => {
  return request.get('/api/inventory/query', { params });
};

// 获取商品列表（用于入库/出库时选择商品）
export const getProductList = (keyword) => {
  return request.get('/products', { params: { keyword } });
};

// 获取供应商列表
export const getSuppliers = () => {
  return request.get('/suppliers');
};

// 获取仓库列表
export const getWarehouses = () => {
  return request.get('/warehouses');
};

// 获取库存统计数据
export const getInventoryStats = async () => {
  try {
    // 获取总库存
    const totalInventory = await request.get('/api/inventory/total');
    // 获取材料库存
    const materialInventory = await request.get('/api/inventory/material');
    // 获取成品库存
    const productInventory = await request.get('/api/inventory/product');
    // 获取占用库位
    const occupiedLocations = await request.get('/api/inventory/locations');

    return {
      data: [
        {
          id: 1,
          label: '总库存',
          value: totalInventory.data.toLocaleString(),
          type: 'primary',
          icon: 'icon-cangku'
        },
        {
          id: 2,
          label: '材料库存',
          value: materialInventory.data.toLocaleString(),
          type: 'success',
          icon: 'icon-cailiao'
        },
        {
          id: 3,
          label: '成品库存',
          value: productInventory.data.toLocaleString(),
          type: 'warning',
          icon: 'icon-chengpin'
        },
        {
          id: 4,
          label: '占用库位',
          value: occupiedLocations.data.toString(),
          type: 'danger',
          icon: 'icon-kuwei'
        }
      ]
    };
  } catch (error) {
    console.error('Failed to fetch inventory stats:', error);
    throw error;
  }
};

// 更新库存数量

export const updateInventory = (data) => {
  return request.post('/api/inventory/update', data);
};

// 获取最近操作记录 - 合并入库和出库记录
export const getRecentRecords = async () => {
  try {
    // 获取最近的入库记录
    const inboundRes = await request.get('/api/inbound/history', {
      params: { page: 1, pageSize: 20 }
    });
    // 获取最近的出库记录
    const outboundRes = await request.get('/api/outbound/history', {
      params: { page: 1, pageSize: 20 }
    });

    // 处理入库记录
    const inboundRecords = inboundRes.data.list.map(item => ({
      goods: item.productName,
      operation: '入库',
      quantity: item.quantity,
      time: new Date(item.inDate).toLocaleString()
    }));

    // 处理出库记录
    const outboundRecords = outboundRes.data.list.map(item => ({
      goods: item.productName,
      operation: '出库',
      quantity: item.quantity,
      time: new Date(item.outDate).toLocaleString()
    }));

    // 合并并按时间排序
    const allRecords = [...inboundRecords, ...outboundRecords]
      .sort((a, b) => new Date(b.time) - new Date(a.time));

    return { data: allRecords };
  } catch (error) {
    console.error('Failed to fetch recent records:', error);
    throw error;
  }
};
