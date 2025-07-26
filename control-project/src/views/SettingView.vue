<script setup>
import { reactive, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { ElForm, ElFormItem, ElInput, ElButton, ElUpload, ElCard, ElRow, ElCol,  ElAvatar } from 'element-plus';
import { messageManager } from '@/utils/messageManager';
import { uploadAvatar, updateUserInfo } from '@/api/Setting';

// 个人信息
const userInfo = reactive({
  username: '管理员',
  email: 'admin@example.com',
  phone: '',
  avatar: 'https://picsum.photos/100/100'
});


// 表单验证规则
const userInfoRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ]
};

// 上传头像
const userStore = useUserStore();
const handleAvatarUpload = async (rawFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', rawFile);
    const res = await uploadAvatar(formData);
    userInfo.avatar = res.data.avatarUrl;
    userStore.updateAvatar(res.data.avatarUrl); // 更新store中的头像
    messageManager.success('头像上传成功');
  } catch (error) {
    messageManager.error('头像上传失败');
    console.error('上传失败:', error);
  }
};

// 保存个人信息
const saveUserInfo = async () => {
  try {
    // eslint-disable-next-line no-undef
    await $refs.userInfoFormRef.validate();
    await updateUserInfo(userInfo);
    messageManager.success('个人信息保存成功');
  } catch (error) {
    if (error.name !== 'ValidationError') {
      messageManager.error('个人信息保存失败');
      console.error('保存失败:', error);
    }
  }
};

// 页面加载时
onMounted(() => {
});
</script>

<template>
  <main class="settings-container">
    <h1 class="settings-title">系统设置</h1>

    <ElRow :gutter="20">
      <!-- 个人信息设置 -->
      <ElCol :span="24">
        <ElCard class="settings-card">
          <template v-slot:header>
            <div class="card-header">
              <span>个人信息</span>
            </div>
          </template>

          <ElRow :gutter="20">
            <ElCol :span="6" class="avatar-col">
              <ElUpload action="#" :show-file-list="false" :before-upload="handleAvatarUpload" class="avatar-uploader">
                <ElAvatar :src="userInfo.avatar" size="100" class="avatar" />
                <div class="avatar-text">点击上传头像</div>
              </ElUpload>
            </ElCol>

            <ElCol :span="18">
              <ElForm ref="userInfoFormRef" :model="userInfo" :rules="userInfoRules" label-width="100px">
                <ElFormItem prop="username" label="用户名">
                  <ElInput v-model="userInfo.username" placeholder="请输入用户名" />
                </ElFormItem>
                <ElFormItem prop="email" label="邮箱">
                  <ElInput v-model="userInfo.email" type="email" placeholder="请输入邮箱" />
                </ElFormItem>
                <ElFormItem prop="phone" label="手机号">
                  <ElInput v-model="userInfo.phone" placeholder="请输入手机号" />
                </ElFormItem>
                <ElFormItem>
                  <ElButton type="primary" @click="saveUserInfo">保存信息</ElButton>
                </ElFormItem>
              </ElForm>
            </ElCol>
          </ElRow>
        </ElCard>
      </ElCol>

    </ElRow>
  </main>
</template>

<style scoped>
.settings-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.settings-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

.settings-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.avatar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
}

.avatar {
  margin-bottom: 10px;
}

.avatar-text {
  color: #666;
  font-size: 14px;
}
</style>
