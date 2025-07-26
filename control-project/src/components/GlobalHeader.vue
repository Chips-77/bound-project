<template>
  <div class="header-container">
    <el-dropdown trigger="click" placement="bottom-end">
      <div class="user-info" style="cursor: pointer;">
        <img :src="avatar" alt="用户头像" class="avatar"/>
        <span class="username">{{ username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>
            <div class="user-detail">
              <img :src="avatar" alt="用户头像" class="dropdown-avatar"/>
              <div class="user-info-text">
                <p class="dropdown-username">{{ username }}</p>
                <p class="dropdown-email">{{ userStore.userInfo?.email || 'admin@example.com' }}</p>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided></el-dropdown-item>
          <el-dropdown-item icon="User"><router-link to="/setting">个人设置</router-link></el-dropdown-item>
          <el-dropdown-item icon="HelpFilled"><router-link to="/help-center">帮助中心</router-link></el-dropdown-item>
          <el-dropdown-item icon="Logout" style="color: #f56c6c;" @click="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { logout } from '@/api/auth'

const userStore = useUserStore()
const router = useRouter()
const { avatar, username } = userStore

onMounted(() => {
  userStore.fetchUserInfo()
})

const handleLogout = async () => {
  try {
    await logout()
    userStore.$reset()
    router.push('/login')
    ElMessage.success('退出登录成功')
  } catch (error) {
    ElMessage.error('退出登录失败，请重试')
    console.error('Logout failed:', error)
  }
}
</script>

<style>
.header-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 2.5rem; /* 使用相对单位 */
  height: 2.5rem; /* 使用相对单位 */
  border-radius: 50%;
  object-fit: cover;
}

.username {
  color: #333;
  font-weight: 500;
  font-size: 1rem; /* 使用相对单位 */
}

/* 下拉菜单样式 */
.user-detail {
  display: flex;
  align-items: center;
  padding: 10px;
}

.dropdown-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-info-text {
  flex: 1;
}

.dropdown-username {
  font-weight: 600;
  margin: 0 0 4px 0;
}

.dropdown-email {
  font-size: 12px;
  color: #606266;
  margin: 0;
}

/* 个人设置和帮助中心菜单项样式 */
.el-dropdown-menu .el-dropdown-item:nth-child(3) .el-dropdown-item__content,
.el-dropdown-menu .el-dropdown-item:nth-child(4) .el-dropdown-item__content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333 !important;
}

/* 媒体查询 - 在小屏幕上调整大小 */
@media screen and (max-width: 768px) {
  .avatar {
    width: 2rem;
    height: 2rem;
  }
  .username {
    font-size: 0.875rem;
  }
}

@media screen and (max-width: 480px) {
  .avatar {
    width: 1.75rem;
    height: 1.75rem;
  }
  .username {
    display: none; /* 在极小屏幕上隐藏用户名 */
  }
}
</style>
