<template>
  <div class="help-center-container">
    <div class="help-center-header">
      <h1>帮助中心</h1>
      <p>欢迎使用库存管理系统帮助中心，这里提供系统的使用指南和常见问题解答。</p>
    </div>

    <div class="help-center-content">
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="系统介绍" name="introduction">
          <div class="tab-content">
            <h2>系统概述</h2>
            <p>库存管理系统是一个用于管理企业库存的现代化应用，提供了库存的入库、出库、查询和统计等功能，帮助企业高效管理库存资产。</p>

            <h2>主要功能</h2>
            <ul>
              <li>库存入库：记录商品的入库信息，包括数量、单价、供应商等</li>
              <li>库存出库：记录商品的出库信息，包括数量、客户等</li>
              <li>库存查询：支持按多种条件查询库存信息</li>
              <li>统计分析：提供库存数据的统计报表和图表分析</li>
              <li>个人设置：支持用户修改个人信息和上传头像</li>
            </ul>

            <h2>技术架构</h2>
            <p>本系统采用前后端分离架构，前端使用Vue.js + Element Plus + Pinia，后端采用RESTful API设计风格。</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="使用指南" name="guide">
          <div class="tab-content">
            <h2>登录系统</h2>
            <p>1. 打开系统登录页面，输入用户名和密码</p>
            <p>2. 点击"登录"按钮，进入系统首页</p>

            <h2>库存入库操作</h2>
            <p>1. 点击左侧导航栏的"入库"菜单</p>
            <p>2. 填写商品信息、数量、单价等必填项</p>
            <p>3. 点击"提交"按钮，完成入库操作</p>

            <h2>库存出库操作</h2>
            <p>1. 点击左侧导航栏的"出库"菜单</p>
            <p>2. 选择要出库的商品，填写出库数量和客户信息</p>
            <p>3. 点击"提交"按钮，完成出库操作</p>

            <h2>库存查询</h2>
            <p>1. 点击左侧导航栏的"统计查询"菜单</p>
            <p>2. 设置查询条件，如商品名称、日期范围等</p>
            <p>3. 点击"查询"按钮，查看查询结果</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="常见问题" name="faq">
          <div class="tab-content">
            <el-collapse default-active-names="[1]">
              <el-collapse-item name="1" title="如何修改个人信息？">
                <div class="faq-content">
                  <p>点击右上角头像，选择"个人设置"，进入个人信息页面后即可修改个人信息。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2" title="如何重置密码？">
                <div class="faq-content">
                  <p>目前系统暂不支持在线重置密码，请联系系统管理员进行密码重置。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="3" title="入库时提示商品不存在怎么办？">
                <div class="faq-content">
                  <p>请先确认商品信息是否正确，如果商品确实不存在，请联系管理员添加商品信息。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="4" title="如何导出库存报表？">
                <div class="faq-content">
                  <p>在统计查询页面，点击查询结果右上角的"导出"按钮，即可导出当前查询结果的报表。</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="5" title="系统支持哪些浏览器？">
                <div class="faq-content">
                  <p>系统支持Chrome、Firefox、Edge等现代浏览器，建议使用Chrome浏览器以获得最佳体验。</p>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>

        <el-tab-pane label="联系我们" name="contact">
          <div class="tab-content">
            <div class="contact-info">
              <p><i class="el-icon-phone"></i> 联系电话：待定</p>
              <p><i class="el-icon-message"></i> 电子邮箱：support@example.com</p>
              <p><i class="el-icon-location"></i> 公司地址：广州市白云区杰郎电器</p>
            </div>

            <!-- <div class="feedback-form">
              <h3>意见反馈</h3>
              <el-form :model="feedbackForm" label-width="80px">
                <el-form-item label="您的姓名">
                  <el-input v-model="feedbackForm.name"></el-input>
                </el-form-item>
                <el-form-item label="联系邮箱">
                  <el-input v-model="feedbackForm.email"></el-input>
                </el-form-item>
                <el-form-item label="反馈内容">
                  <el-input type="textarea" v-model="feedbackForm.content" :rows="4"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
                </el-form-item>
              </el-form>
            </div> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import { ElMessage } from 'element-plus'

const activeTab = ref('introduction')
// const feedbackForm = ref({
//   name: '',
//   email: '',
//   content: ''
// })

// const submitFeedback = () => {
//   // 简单的表单验证
//   if (!feedbackForm.value.name) {
//     ElMessage.warning('请输入您的姓名')
//     return
//   }
//   if (!feedbackForm.value.email) {
//     ElMessage.warning('请输入联系邮箱')
//     return
//   }
//   if (!feedbackForm.value.content) {
//     ElMessage.warning('请输入反馈内容')
//     return
//   }

//   // 这里可以添加提交反馈的API调用
//   ElMessage.success('反馈提交成功，我们会尽快处理您的意见！')
//   feedbackForm.value = {
//     name: '',
//     email: '',
//     content: ''
//   }
// }
</script>

<style scoped>
.help-center-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.help-center-header {
  text-align: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.help-center-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #333;
}

.help-center-header p {
  color: #666;
  font-size: 16px;
}

.help-center-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.tab-content {
  padding: 20px;
}

.tab-content h2 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 20px;
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.tab-content p {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #666;
}

.tab-content ul {
  margin-bottom: 20px;
  padding-left: 20px;
}

.tab-content li {
  margin-bottom: 5px;
  line-height: 1.6;
  color: #666;
}

.faq-content {
  padding: 10px 0;
}

.contact-info {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.contact-info p {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.contact-info i {
  margin-right: 10px;
  color: #409eff;
}

.feedback-form {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}
</style>
