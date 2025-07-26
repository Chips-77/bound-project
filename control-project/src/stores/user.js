import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    isLoading: false,
    error: null
  }),
  getters: {
    avatar: (state) => state.userInfo?.avatar || 'https://picsum.photos/40/40',
    username: (state) => state.userInfo?.username || '管理员'
  },
  actions: {
    async fetchUserInfo() {
      this.isLoading = true
      this.error = null
      try {
        const data = await getUserInfo()
        this.userInfo = data
        return data
      } catch (err) {
        this.error = err
        throw err
      } finally {
        this.isLoading = false
      }
    },
    updateAvatar(newAvatar) {
      if (this.userInfo) {
        this.userInfo.avatar = newAvatar
      }
    }
  }
})
