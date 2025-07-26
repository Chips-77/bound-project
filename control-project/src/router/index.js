import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import UserLogin from '@/views/UserLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: UserLogin
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
        path:'/inbound',
        name:'Inbound',
        component:()=>import('@/views/InboundView.vue')
    },
    {
      path:'/outbound',
      name:'Outbound',
      component:()=>import('@/views/OutboundView.vue')
    },
    {
      path:'/setting',
      name:'Setting',
      component:()=>import('@/views/SettingView.vue')
    },
    {
      path:'/statistics',
      name:'Statistics',
        component:()=>import('@/views/StatisticsView.vue')
     },
    {
      path:'/help-center',
      name:'HelpCenter',
      component:()=>import('@/views/HelpCenterView.vue')
    }
  ],
})

// 添加路由守卫
router.beforeEach((to, from, next) => {
  // 获取本地存储的token
  const token = localStorage.getItem('token');

  // 如果已登录且访问的是登录页，则跳转到首页
  if (token && to.path === '/login') {
    next('/home');
  }
  // 如果未登录且访问的不是登录页，则跳转到登录页
  else if (!token && to.path !== '/login') {
    next('/login');
  }
  // 其他情况正常访问
  else {
    next();
  }
})

export default router
