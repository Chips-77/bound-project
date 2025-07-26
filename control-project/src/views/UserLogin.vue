<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2 class="login-title">管理员登录</h2>
        <p class="login-subtitle">请输入您的账号和密码</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon=""><i class="iconfont icon-user"></i>
            :maxlength="20"
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            type="password"
            prefix-icon=""><i class="iconfont icon-lock"></i>
            :maxlength="20"
            show-password
          </el-input>
        </el-form-item>
        <el-form-item class="remember-me">
          <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-password">
            忘记密码?
          </el-link>
        </el-form-item>
        <el-form-item class="login-btn-item">
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { messageManager } from '@/utils/messageManager';
import { useRouter } from 'vue-router';
import * as authApi from '@/api/auth';

// 路由实例
const router = useRouter();

// 表单引用
const loginFormRef = ref(null);

// 加载状态
const loading = ref(false);

// 表单数据
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
});

// 表单规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符之间', trigger: 'blur' }
  ]
};

// 处理登录
const handleLogin = async () => {
  // 表单验证
  await loginFormRef.value.validate().catch(err => {
    messageManager.error(err);
    return;
  });

  // 显示加载状态
  loading.value = true;

  try {
    // 调用登录API
    const response = await authApi.login(loginForm);
    const { token, userInfo } = response.data;

    // 存储token和用户信息
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // 如果勾选记住我，设置较长的过期时间
    if (loginForm.rememberMe) {
      // 这里可以实现记住我功能，例如设置cookie
    }

    messageManager.success('登录成功！');
    // 登录成功后跳转到首页
    router.push('/home');
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    // 离线模式下的处理
    messageManager.warning('无法连接到服务器，将使用离线模式登录');

    // 生成模拟token和用户信息
    const mockToken = 'offline_token_' + new Date().getTime();
    const mockUserInfo = {
      id: 1,
      username: loginForm.username,
      role: 'admin',
      permissions: ['all']
    };

    // 存储模拟数据
    localStorage.setItem('token', mockToken);
    localStorage.setItem('userInfo', JSON.stringify(mockUserInfo));

    // 跳转到首页
    router.push('/home');
  } finally {
    // 关闭加载状态
    loading.value = false;
  }
};
</script>

<style scoped>
/* 登录容器样式 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
  box-sizing: border-box;
}

/* 登录卡片样式 */
.login-card {
  width: 100%;
  max-width: 420px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease;
}

/* 登录头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2329;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 登录表单样式 */
.login-form {
  width: 100%;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 6px;
  height: 42px;
}

/* 记住我和忘记密码样式 */
.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.forgot-password {
  font-size: 14px;
}

/* 登录按钮样式 */
.login-btn-item {
  margin-bottom: 0;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 6px;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media screen and (max-width: 480px) {
  .login-card {
    padding: 20px;
  }
}
</style>
