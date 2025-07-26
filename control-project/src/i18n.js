import { createI18n } from 'vue-i18n';

// 定义翻译资源
const messages = {
  'zh-CN': {
    home: {
      pageTitle: '仓库概览',
      pageSubtitle: '实时监控仓库运营状态',
      recentRecords: '最近操作记录',
      allOperations: '全部操作',
      inbound: '入库',
      outbound: '出库',
      searchGoods: '搜索商品',
      goods: '商品',
      operation: '操作',
      quantity: '数量',
      time: '时间',
      noRecords: '暂无操作记录',
      loading: '加载中...'
    },
    setting: {
      personalInfo: '个人信息',
      changePassword: '修改密码',
      systemSettings: '系统设置',
      avatar: '头像',
      username: '用户名',
      email: '邮箱',
      phone: '手机号',
      save: '保存',
      oldPassword: '旧密码',
      newPassword: '新密码',
      confirmPassword: '确认密码',
      themeColor: '主题色',
      darkMode: '深色模式',
      language: '语言',
      notification: '通知',
      saveSuccess: '保存成功'
    }
  },
  'en-US': {
    home: {
      pageTitle: 'Warehouse Overview',
      pageSubtitle: 'Real-time monitoring of warehouse operation status',
      recentRecords: 'Recent Operation Records',
      allOperations: 'All Operations',
      inbound: 'Inbound',
      outbound: 'Outbound',
      searchGoods: 'Search Goods',
      goods: 'Goods',
      operation: 'Operation',
      quantity: 'Quantity',
      time: 'Time',
      noRecords: 'No operation records',
      loading: 'Loading...'
    },
    setting: {
      personalInfo: 'Personal Information',
      changePassword: 'Change Password',
      systemSettings: 'System Settings',
      avatar: 'Avatar',
      username: 'Username',
      email: 'Email',
      phone: 'Phone',
      save: 'Save',
      oldPassword: 'Old Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      themeColor: 'Theme Color',
      darkMode: 'Dark Mode',
      language: 'Language',
      notification: 'Notification',
      saveSuccess: 'Save Successfully'
    }
  }
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN', // 默认语言
  globalInjection: true,
  messages
});

export default i18n;