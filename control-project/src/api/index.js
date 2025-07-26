// 导入各模块接口
import * as inApi from '@/api/Inbound';
import * as outApi from '@/api/Outbound';
import * as queryApi from '@/api/Statistics';

// 导出
export const inventoryApi = {
  ...inApi,
  ...outApi,
  ...queryApi
};
