<template>
  <div class="home-container">
    <h1 class="page-title">{{ t('home.pageTitle') }}</h1>
    <p class="page-subtitle">{{ t('home.pageSubtitle') }}</p>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row" type="flex" justify="space-around">
      <el-col :span="8" v-for="stat in stats" :key="stat.id">
        <el-card class="stat-card" style="width: 100%">
          <div class="stat-content">
            <i :class="['iconfont', 'icon-' + stat.type, stat.icon]"></i>
            <div class="stat-info">
              <p class="stat-label">{{ stat.label }}</p>
              <p class="stat-value">{{ stat.value }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-row :gutter="20" class="actions-row">
      <el-col :span="6" v-for="action in actions" :key="action.id">
        <el-button :type="action.type" class="action-btn" size="large"
          @click="action.id === 1 ? handleInbound() : action.id === 2 ? handleOutbound() : action.id === 3 ? handleInventory() : handleOrders()">
          <i :class="['iconfont', action.icon]"></i>
          <span>{{ action.label }}</span>
        </el-button>
      </el-col>
    </el-row>

    <!-- 最近记录 -->
    <el-card class="records-card">
      <h2 class="records-title">{{ t('home.recentRecords') }}</h2>
      <div class="records-filter">
        <el-select v-model="filterType" :placeholder="t('home.allOperations')" class="filter-select">
          <el-option :label="t('home.allOperations')" value="all" />
          <el-option :label="t('home.inbound')" value="入库" />
          <el-option :label="t('home.outbound')" value="出库" />
        </el-select>
        <el-input v-model="filterKeyword" :placeholder="t('home.searchGoods')" class="filter-input" />
      </div>
      <el-table :data="filteredRecords" stripe style="width: 100%">
        <el-table-column prop="goods" :label="t('home.goods')" width="200" />
        <el-table-column prop="operation" :label="t('home.operation')" width="100" />
        <el-table-column prop="quantity" :label="t('home.quantity')" width="80" />
        <el-table-column prop="time" :label="t('home.time')" />
      </el-table>
      <div class="table-footer" v-if="filteredRecords.length === 0 && !isLoading">{{ t('home.noRecords') }}</div>
      <div class="pagination-container" v-else-if="!isLoading">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="records.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
  <el-loading v-model="isLoading" :text="t('home.loading')" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ElRow, ElCol, ElCard, ElButton, ElTable, ElTableColumn, ElLoading, ElSelect, ElOption, ElInput, ElPagination } from 'element-plus';
import { messageManager } from '@/utils/messageManager';
import * as statisticsApi from '@/api/Statistics';

// 国际化
const { t } = useI18n();
// 路由导航
const router = useRouter();

// 按钮点击事件处理函数
const handleInbound = () => {
  router.push('/inbound');
};

const handleOutbound = () => {
  router.push('/outbound');
};

const handleInventory = () => {
  router.push('/statistics');
};

const handleOrders = () => {
  router.push('/setting');
};

// 数据
const stats = ref([]);
const isLoading = ref(false);

// 快捷操作
const actions = ref([
  { id: 1, label: '入库', type: 'primary', icon: 'icon-ruku' },
  { id: 2, label: '出库', type: 'danger', icon: 'icon-chuku' },
  { id: 3, label: '查询库存', type: 'success', icon: 'icon-chaxun' },
  { id: 4, label: '设置', type: 'warning', icon: 'icon-dingdan' }
]);

const records = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const filterType = ref('all');
const filterKeyword = ref('');

// 筛选后的记录
const filteredRecords = computed(() => {
  let result = [...records.value];

  // 按操作类型筛选
  if (filterType.value !== 'all') {
    result = result.filter(record => record.operation === filterType.value);
  }

  // 按商品名称搜索
  if (filterKeyword.value) {
    const keyword = filterKeyword.value.toLowerCase();
    result = result.filter(record => record.goods.toLowerCase().includes(keyword));
  }

  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return result.slice(startIndex, startIndex + pageSize.value);
});

// 分页方法
const handleSizeChange = (size) => {
  pageSize.value = size;
  currentPage.value = 1; // 重置为第一页
};

const handleCurrentChange = (current) => {
  currentPage.value = current;
};

// 获取统计数据
const fetchStats = async () => {
  try {
    isLoading.value = true;
    // 这里假设后端会提供getInventoryStats接口
    const res = await statisticsApi.getInventoryStats();
    // 过滤掉占用库位相关的统计项
    stats.value = (res.data || []).filter(stat => stat.label !== '占用库位');
  } catch (error) {
    messageManager.error('获取统计数据失败');
    console.error('Failed to fetch stats:', error);
    // 失败时使用模拟数据
    stats.value = [
      { id: 1, label: '总库存', value: '获取失败', type: 'primary', icon: 'icon-cangku' },
      { id: 2, label: '材料库存', value: '获取失败', type: 'success', icon: 'icon-cailiao' },
      { id: 3, label: '成品库存', value: '获取失败', type: 'warning', icon: 'icon-chengpin' }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 获取最近操作记录
const fetchRecords = async () => {
  try {
    isLoading.value = true;
    const res = await statisticsApi.getRecentRecords();
    records.value = res.data || [];
  } catch (error) {
    messageManager.error('获取最近操作记录失败');
    console.error('Failed to fetch recent records:', error);
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时获取数据
onMounted(() => {
  fetchStats();
  fetchRecords();
});
</script>

<style scoped>
.home-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-title {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

.page-subtitle {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.stats-row, .actions-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.12);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 15px;
}

.icon-primary {
  color: #409eff;
  font-size: 28px;
  margin-right: 15px;
}

.icon-success {
  color: #67c23a;
  font-size: 28px;
  margin-right: 15px;
}

.icon-warning {
  color: #e6a23c;
  font-size: 28px;
  margin-right: 15px;
}

.icon-danger {
  color: #f56c6c;
  font-size: 28px;
  margin-right: 15px;
}

.stat-label {
  color: #666;
  margin-bottom: 5px;
  font-size: 14px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.action-btn {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.records-card {
  margin-top: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.records-title {
  font-size: 18px;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
  font-weight: 600;
}

.records-filter {
  display: flex;
  margin-bottom: 15px;
  gap: 10px;
}

.filter-select {
  width: 150px;
}

.filter-input {
  width: 200px;
}

.table-footer {
  text-align: center;
  padding: 20px;
  color: #999;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
