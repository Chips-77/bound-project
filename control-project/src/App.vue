<template>
  <div class="common-layout">
    <template v-if="!isLoginPage">
      <el-container>
        <el-aside>
          <GlobalNav />
        </el-aside>
        <el-container>
          <el-header>
            <GlobalHeader />
          </el-header>
          <el-main>
            <RouterView />
          </el-main>
        </el-container>
      </el-container>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import GlobalHeader from './components/GlobalHeader.vue';
import GlobalNav from './components/GlobalNav.vue';

// 判断是否是登录页面
const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<style>
.common-layout {
  height: 100vh;
  width: 100%;
}

.el-container {
  height: auto;
}

.el-aside {
  width: auto;
  padding: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
}
.el-container{
  width: 100%;
}
.el-main{
  padding-top: 5px;
  padding-left: 240px;
}
@media (max-width: 768px) {
  .common-layout {
    height: auto;
    min-height: 100vh;
  }

  .el-aside {
    width:auto;
    height: auto;
  }
}
</style>
