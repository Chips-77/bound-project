<template>
  <div class="warehouse-out-page">
    <!-- 出库表单卡片 -->
    <el-card class="main-card">
      <!-- 出库单基本信息 -->
      <div class="form-header">
        <h2 class="form-title"><i class="iconfont icon-dingdan"></i> 出库单信息</h2>
        <el-divider />
      </div>

      <el-row :gutter="20" class="form-row">
        <el-col :span="6">
          <el-form-item label="出库单号" prop="receiptNo">
            <el-input v-model="form.receiptNo" placeholder="输入单号" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="出库日期" prop="receiptDate">
            <el-date-picker
              v-model="form.receiptDate"
              type="date"
              placeholder="选择出库日期"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="customer">
            <el-select v-model="form.customer" placeholder="选择客户">
              <el-option
                v-for="customer in customers"
                :key="customer.id"
                :label="customer.name"
                :value="customer.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="仓库" prop="warehouse">
            <el-select v-model="form.warehouse" placeholder="选择仓库">
              <el-option
                v-for="wh in warehouses"
                :key="wh.id"
                :label="`${wh.name}(${wh.category === 'finished' ? '成品仓' : '材料仓'})`"
                :value="wh.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="form-row">
        <el-col :span="12">
          <el-form-item label="出库备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入出库备注信息"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人" prop="operator">
            <el-input v-model="form.operator" placeholder="请输入经办人姓名" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 商品列表区域 -->
      <div class="form-header product-header">
        <h2 class="form-title"><i class="iconfont icon-shangpin"></i> 出库商品列表</h2>
        <el-button
            type="primary"
            @click="handleAddProduct"
            class="add-btn"><i class="iconfont icon-tianjia"></i>
            添加商品
          </el-button>
        <!-- <el-divider class="header-divider" /> -->
      </div>

      <!-- 商品表格 -->
      <el-table
        :data="form.productList"
        border
        stripe
        class="product-table"
        :height="tableHeight"
        show-empty="false"
      >
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
          min-width="180"
        />
        <el-table-column
          prop="sku"
          label="SKU"
          align="center"
          min-width="120"
        />
        <el-table-column
          prop="spec"
          label="规格型号"
          align="center"
          min-width="150"
        />
        <el-table-column
          prop="unit"
          label="单位"
          align="center"
          width="80"
        />
        <el-table-column
          prop="salePrice"
          label="销售单价(元)"
          align="center"
          width="120"
          :formatter="formatPrice"
        />
        <el-table-column
          prop="quantity"
          label="出库数量"
          align="center"
          width="120"
        >
          <template #default="scope">
            <el-input-number
              v-model="scope.row.quantity"
              :min="1"
              :step="1"
              @change="handleQuantityChange(scope.row, scope.$index)"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额(元)"
          align="center"
          width="120"
          :formatter="formatPrice"
        />
        <el-table-column
          label="操作"
          align="center"
          width="100"
        >
          <template #default="scope">
            <el-button
              type="text"
              text-color="#ff4d4f"
              @click="handleDeleteProduct(scope.$index)"
              icon=""><i class="iconfont icon-shanchu"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 空状态提示
      <div v-if="form.productList.length === 0" class="empty-state">
        <el-empty
          description="暂无商品，请点击添加商品按钮"
          :image-size="100"
        />
      </div> -->

      <!-- 合计信息 -->
      <div v-if="form.productList.length > 0" class="total-info">
        <div class="total-item">
          <span>商品总数：</span>
          <span class="value">{{ totalQuantity }}</span>
        </div>
        <div class="total-item">
          <span>出库总金额：</span>
          <span class="value">{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button @click="handleBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交出库单</el-button>
      </div>
    </el-card>

    <!-- 选择商品弹窗 -->
    <el-dialog
      v-model="productDialogVisible"
      title="选择商品"
      :width="dialogWidth"
      @close="handleDialogClose"
      custom-class="center-dialog"
    >
      <el-input
          v-model="productSearch"
          placeholder="搜索商品名称或SKU"
          prefix-icon=""><i class="iconfont icon-chaxun"></i>
          class="search-input"
        </el-input>

      <el-table
        :data="filteredProducts"
        border
        stripe
        :height="dialogTableHeight"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="name"
          label="商品名称"
          min-width="180"
        />
        <el-table-column
          prop="sku"
          label="SKU"
          min-width="120"
        />
        <el-table-column
          prop="spec"
          label="规格型号"
          min-width="150"
        />
        <el-table-column
          prop="unit"
          label="单位"
          width="80"
        />
        <el-table-column
          prop="salePrice"
          label="参考销售价(元)"
          width="130"
          :formatter="formatPrice"
        />
        <el-table-column
          prop="stock"
          label="库存数量"
          width="100"
        />
      </el-table>

      <template #footer>
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSelectProducts">确认添加</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessageBox, ElLoading } from 'element-plus';
import { messageManager } from '@/utils/messageManager';
import { useRouter } from 'vue-router';
// 导入API
import * as outboundApi from '@/api/Outbound';
import * as statisticsApi from '@/api/Statistics';

// 路由实例
const router = useRouter();

// 表单数据
const form = reactive({
  receiptNo: '',
  receiptDate: new Date().toISOString().split('T')[0],
  customer: '',
  warehouse: '',
  remark: '',
  operator: '',
  productList: []
});

// 客户列表
const customers = ref([]);

// 仓库列表
const warehouses = ref([]);

// 可选商品列表（含库存信息）
const allProducts = ref([]);

// 商品选择弹窗相关
const productDialogVisible = ref(false);
const productSearch = ref('');
const selectedProducts = ref([]);

// 表格高度计算
const tableHeight = ref('');
const dialogWidth = ref('80%');
const dialogTableHeight = ref('400px');

// 获取客户列表
const fetchCustomers = async () => {
  try {
    // 假设API中有获取客户的方法，如果没有需要创建
    const res = await statisticsApi.getCustomers();
    customers.value = res.data || [];
  } catch (error) {
    console.error('获取客户列表失败:', error);
    messageManager.error('获取客户列表失败');
  }
};

// 获取仓库列表
const fetchWarehouses = async () => {
  try {
    const res = await statisticsApi.getWarehouses();
    warehouses.value = res.data || [];
  } catch (error) {
    console.error('获取仓库列表失败:', error);
    messageManager.error('获取仓库列表失败');
  }
};

// 获取商品列表
const fetchProducts = async () => {
  try {
    const res = await statisticsApi.getProductList('');
    allProducts.value = res.data || [];
  } catch (error) {
    console.error('获取商品列表失败:', error);
    messageManager.error('获取商品列表失败');
  }
};

// 过滤商品列表
const filteredProducts = computed(() => {
  if (!productSearch.value) return allProducts.value;
  const searchStr = productSearch.value.toLowerCase();
  return allProducts.value.filter(product =>
    product.name.toLowerCase().includes(searchStr) ||
    product.sku.toLowerCase().includes(searchStr)
  );
});

// 计算总数量和总金额
const totalQuantity = computed(() => {
  return form.productList.reduce((sum, item) => sum + (item.quantity || 0), 0);
});

const totalAmount = computed(() => {
  return form.productList.reduce((sum, item) =>
    sum + (item.quantity || 0) * (item.salePrice || 0), 0);
});

// 格式化价格
const formatPrice = (price) => {
  return '¥' + Number(price).toFixed(2);
};

// 生命周期钩子
onMounted(() => {
  calculateTableHeight();
  window.addEventListener('resize', calculateTableHeight);
  // 加载数据
  fetchCustomers();
  fetchWarehouses();
  fetchProducts();
});

// 计算表格高度
const calculateTableHeight = () => {
  const windowHeight = window.innerHeight;
  tableHeight.value = (windowHeight - 400) + 'px';
  dialogTableHeight.value = (windowHeight - 300) + 'px';
};

// 处理返回
const handleBack = () => {
  ElMessageBox.confirm('确定要取消出库单编辑吗？未保存的数据将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/');
    messageManager.info('已取消出库单编辑');
  });
};

// 打开商品选择弹窗
const handleAddProduct = () => {
  productDialogVisible.value = true;
  selectedProducts.value = [];
  productSearch.value = '';
};

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedProducts.value = selection;
};

// 确认添加选中的商品
const confirmSelectProducts = () => {
  if (selectedProducts.value.length === 0) {
    messageManager.warning('请选择至少一个商品');
    return;
  }

  selectedProducts.value.forEach(product => {
    const exists = form.productList.some(item => item.id === product.id);
    if (!exists) {
      form.productList.push({
        ...product,
        quantity: 1,
        amount: product.salePrice
      });
    }
  });

  productDialogVisible.value = false;
  messageManager.success(`已添加 ${selectedProducts.value.length} 个商品`);
};

// 关闭弹窗
const handleDialogClose = () => {
  selectedProducts.value = [];
  productSearch.value = '';
};

// 处理数量变化
const handleQuantityChange = (row) => {
  // 检查库存
  if (row.quantity > row.stock) {
    messageManager.warning(`库存不足，当前库存为 ${row.stock}`);
    row.quantity = row.stock;
  }
  row.amount = row.quantity * row.salePrice;
};

// 删除商品
const handleDeleteProduct = (index) => {
  ElMessageBox.confirm('确定要从出库单中移除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.productList.splice(index, 1);
    messageManager.success('商品已移除');
  });
};

// 提交出库单
const handleSubmit = async () => {
  if (!form.customer) {
    messageManager.warning('请选择客户');
    return;
  }
  if (!form.warehouse) {
    messageManager.warning('请选择仓库');
    return;
  }
  if (form.productList.length === 0) {
    messageManager.warning('请至少添加一个出库商品');
    return;
  }
  if (!form.operator) {
    messageManager.warning('请填写经办人');
    return;
  }

  // 检查所有商品库存是否充足
  const insufficientStock = form.productList.some(item => item.quantity > item.stock);
  if (insufficientStock) {
    messageManager.warning('部分商品库存不足，请检查并调整出库数量');
    return;
  }

  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '提交中，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  });

  try {
    // 调用API提交出库单
    await outboundApi.createOutOrder(form);
    loading.close();

    ElMessageBox.success('出库单提交成功！');
    router.push('/'); // 提交成功后跳转到首页
  } catch (error) {
    loading.close();
    messageManager.error(`提交失败：${error.message || '未知错误'}`);
  }
};
</script>

<style scoped>
/* 全局样式优化 */
.warehouse-out-page {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

/* 卡片样式优化 */
.main-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #fff;
}

/* 标题样式优化 */
.form-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2329;
  margin: 0;
  display: flex;
  align-items: center;
}

.form-title i {
  font-size: 20px;
  color: #409eff;
  margin-right: 8px;
}

/* 按钮样式优化 */
.el-button {
  border-radius: 6px;
  padding: 8px 16px;
}

.add-btn {
  margin-left: auto !important; /* 确保按钮靠最右侧 */
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.add-btn i {
  margin-right: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  gap: 10px;
  border-top: 1px solid #f0f0f0;
}

/* 表格样式优化 */
.product-table {
  margin: 0;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.product-table .el-input-number {
  width: 100%;
  box-sizing: border-box;
}

.el-table-column[prop="quantity"] .cell {
  padding: 0 5px;
  min-width: 100px;
}

.el-table th {
  background-color: #f7f9fc;
  font-weight: 600;
  white-space: nowrap; /* 表头不换行 */
}

.el-table td {
  padding: 12px 0;
  white-space: nowrap; /* 表格内容不换行 */
}

/* 表单样式优化 */
.form-row {
  margin-bottom: 20px;
  padding: 0 20px;
}

.el-form-item {
  margin-bottom: 16px;
}

.el-input, .el-select, .el-date-picker {
  width: 100%;
  border-radius: 6px;
}

/* 空状态样式 */
.empty-state {
  padding: 60px 0;
  text-align: center;
}

/* 合计信息样式 */
.total-info {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
  padding: 15px;
  background-color: #f7f9fc;
  border-radius: 8px;
  gap: 30px;
}

.total-item {
  font-size: 14px;
  color: #333;
}

.total-item .value {
  font-weight: 600;
  color: #409eff;
  margin-left: 5px;
}

/* 弹窗样式优化 */
.center-dialog .el-dialog__body {
  padding: 20px;
}

.search-input {
  margin-bottom: 15px;
  border-radius: 6px;
}

/* 自定义动画效果 */
.el-table .el-table__row {
  transition: all 0.2s ease;
}

.el-table .el-table__row:hover {
  background-color: #f7f9fc;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .dialogWidth {
    width: 90% !important;
  }
}

@media screen and (max-width: 768px) {
  .form-row {
    padding: 0 10px;
  }

  .total-info {
    flex-direction: column;
    gap: 10px;
  }
}

/* 其他样式 */
.page-header {
  margin-bottom: 20px;
}

/* 调整分隔线位置 */
.header-divider {
  width: 100%;
  margin: 10px 0;
}

/* 弹窗居中样式 */
:deep(.center-dialog .el-dialog__wrapper) {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.center-dialog .el-dialog) {
  margin: 0 !important; /* 移除默认margin，确保居中 */
}
</style>
