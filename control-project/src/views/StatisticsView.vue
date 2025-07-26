<script setup>
import { ref, onMounted } from 'vue';
import { ElDatePicker, ElSelect, ElOption, ElButton, ElTable, ElTableColumn, ElCard, ElRow, ElCol, ElDialog, ElForm, ElFormItem, ElInput, ElMessage } from 'element-plus';
import * as echarts from 'echarts';
import { queryInventory, getWarehouses, getProductList, updateInventory } from '@/api/Statistics';

// 筛选条件
const filter = ref({
  startTime: '',
  endTime: '',
  warehouseId: '',
  productId: ''
});

// 数据
const inventoryData = ref([]);
const warehouses = ref([]);
const products = ref([]);
const loading = ref(false);
// 弹窗相关
const editDialogVisible = ref(false);
const currentInventory = ref({});
const newQuantity = ref(0);
const editFormRef = ref(null);

// 初始化图表
let inventoryChart = null;
let trendChart = null;

// 获取仓库列表
const fetchWarehouses = async () => {
  try {
    const res = await getWarehouses();
    warehouses.value = res.data || [];
  } catch (error) {
    console.error('获取仓库列表失败:', error);
  }
};

// 获取商品列表
const fetchProducts = async () => {
  try {
    const res = await getProductList('');
    products.value = res.data || [];
  } catch (error) {
    console.error('获取商品列表失败:', error);
  }
};

// 查询统计数据
const queryStatistics = async () => {
  loading.value = true;
  try {
    const res = await queryInventory(filter.value);
    inventoryData.value = res.data || [];
    updateCharts();
  } catch (error) {
    console.error('查询统计数据失败:', error);
  } finally {
    loading.value = false;
  }
};

// 修改库存
const handleEditInventory = (row) => {
  currentInventory.value = { ...row };
  newQuantity.value = row.quantity;
  editDialogVisible.value = true;
};

// 提交修改
const submitEdit = async () => {
  if (!editFormRef.value) return;
  await editFormRef.value.validate();
  try {
    loading.value = true;
    // 调用修改库存API
    await updateInventory({
      productId: currentInventory.value.productId,
      warehouseId: currentInventory.value.warehouseId,
      quantity: newQuantity.value
    });
    ElMessage.success('库存修改成功');
    editDialogVisible.value = false;
    // 重新查询数据
    queryStatistics();
  } catch (error) {
    ElMessage.error('库存修改失败: ' + (error.message || '未知错误'));
    console.error('修改库存失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新图表
const updateCharts = () => {
  // 库存分布图表数据
  const inventoryDistribution = inventoryData.value.map(item => ({
    name: item.productName,
    value: item.quantity
  }));

  // 入库趋势图表数据（模拟）
  const trendData = [
    { month: '1月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
    { month: '2月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
    { month: '3月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
    { month: '4月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
    { month: '5月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
    { month: '6月', in: Math.floor(Math.random() * 1000), out: Math.floor(Math.random() * 800) },
  ];

  // 更新库存分布图表
  if (inventoryChart) {
    inventoryChart.setOption({
      series: [{
        data: inventoryDistribution
      }]
    });
  }

  // 更新入库趋势图表
  if (trendChart) {
    trendChart.setOption({
      xAxis: {
        data: trendData.map(item => item.month)
      },
      series: [
        {
          name: '入库',
          data: trendData.map(item => item.in)
        },
        {
          name: '出库',
          data: trendData.map(item => item.out)
        }
      ]
    });
  }
};

// 初始化图表
const initCharts = () => {
  // 库存分布图表
  const inventoryDom = document.getElementById('inventoryChart');
  if (inventoryDom) {
    inventoryChart = echarts.init(inventoryDom);
    inventoryChart.setOption({
      title: {
        text: '库存分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [{
        name: '库存数量',
        type: 'pie',
        radius: '60%',
        data: [],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    });
  }

  // 入库趋势图表
  const trendDom = document.getElementById('trendChart');
  if (trendDom) {
    trendChart = echarts.init(trendDom);
    trendChart.setOption({
      title: {
        text: '半年出入库趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['入库', '出库'],
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '入库',
          type: 'line',
          data: []
        },
        {
          name: '出库',
          type: 'line',
          data: []
        }
      ]
    });
  }
};

// 页面加载时初始化
onMounted(() => {
  fetchWarehouses();
  fetchProducts();
  initCharts();
  // 初始查询
  queryStatistics();

  // 窗口大小改变时重置图表
  window.addEventListener('resize', () => {
    if (inventoryChart) inventoryChart.resize();
    if (trendChart) trendChart.resize();
  });
});
</script>

<template>
  <main class="statistics-container">
    <ElCard class="filter-card">
      <div class="form-header">
        <h2 class="form-title"><i class="iconfont icon-dingdan"></i> 查询统计 </h2>
        <el-divider />
      </div>
      <div class="filter-form">
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElDatePicker v-model="filter.startTime" type="date" placeholder="选择开始日期" style="width: 100%" />
          </ElCol>
          <ElCol :span="6">
            <ElDatePicker v-model="filter.endTime" type="date" placeholder="选择结束日期" style="width: 100%" />
          </ElCol>
          <ElCol :span="6">
            <ElSelect v-model="filter.warehouseId" placeholder="选择仓库" style="width: 100%">
              <ElOption v-for="warehouse in warehouses" :key="warehouse.id"
                :label="`${warehouse.name}(${warehouse.category === 'finished' ? '成品仓' : '材料仓'})`"
                :value="warehouse.id" />
            </ElSelect>
          </ElCol>
          <ElCol :span="6">
            <ElSelect v-model="filter.productId" placeholder="选择商品" style="width: 100%">
              <ElOption v-for="product in products" :key="product.id" :label="product.name" :value="product.id" />
            </ElSelect>
          </ElCol>
        </ElRow>
        <div class="filter-actions" style="margin-top: 15px; text-align: right;">
          <ElButton type="primary" @click="queryStatistics" :loading="loading">查询</ElButton>
        </div>
      </div>
    </ElCard>

    <div class="charts-container">
      <ElRow :gutter="20">
        <ElCol :span="12">
          <ElCard class="chart-card">
            <div id="inventoryChart" class="chart"></div>
          </ElCard>
        </ElCol>
        <ElCol :span="12">
          <ElCard class="chart-card">
            <div id="trendChart" class="chart"></div>
          </ElCard>
        </ElCol>
      </ElRow>
    </div>

    <ElCard class="data-table-card" style="margin-top: 20px;">
      <ElTable :data="inventoryData" border style="width: 100%">
        <ElTableColumn prop="productId" label="商品ID" width="100"></ElTableColumn>
        <ElTableColumn prop="productName" label="商品名称" width="180"></ElTableColumn>
        <ElTableColumn prop="warehouseName" label="仓库" width="120"></ElTableColumn>
        <ElTableColumn prop="quantity" label="库存数量" width="100"></ElTableColumn>
        <ElTableColumn prop="inboundQuantity" label="入库数量" width="100"></ElTableColumn>
        <ElTableColumn prop="outboundQuantity" label="出库数量" width="100"></ElTableColumn>
        <ElTableColumn prop="lastUpdateTime" label="最后更新时间" width="180"></ElTableColumn>
        <ElTableColumn label="操作" width="120">
          <template #default="scope">
            <ElButton type="primary" size="small" @click="handleEditInventory(scope.row)">修改库存</ElButton>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElCard>

    <!-- 修改库存弹窗 -->
    <ElDialog v-model="editDialogVisible" title="修改库存" width="400px" :before-close="() => editDialogVisible.value = false">
      <ElForm ref="editFormRef" :model="{ quantity: newQuantity }" label-width="100px">
        <ElFormItem label="商品名称" prop="productName" disabled>
          <ElInput v-model="currentInventory.productName" />
        </ElFormItem>
        <ElFormItem label="当前仓库" prop="warehouseName" disabled>
          <ElInput v-model="currentInventory.warehouseName" />
        </ElFormItem>
        <ElFormItem label="当前库存" prop="currentQuantity" disabled>
          <ElInput v-model="currentInventory.quantity" />
        </ElFormItem>
        <ElFormItem label="新库存数量" prop="quantity" :rules="[{ required: true, message: '请输入新库存数量', trigger: 'blur' }, { type: 'number', min: 0, message: '库存数量不能为负数', trigger: 'blur' }]">
          <ElInput v-model.number="newQuantity" type="number" placeholder="请输入新库存数量" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="editDialogVisible.value = false">取消</ElButton>
        <ElButton type="primary" @click="submitEdit" :loading="loading">确定</ElButton>
      </template>
    </ElDialog>
  </main>
</template>

<style scoped>
.statistics-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  width: 100%;
}

.charts-container {
  margin-bottom: 20px;
}

.chart-card {
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart {
  flex: 1;
  width: 100%;
}
</style>
