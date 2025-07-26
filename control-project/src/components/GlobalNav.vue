<template>
  <div class="top-container" :class="{ 'collapsed': isCollapse }">
    <h5 class="title" v-if="!isCollapse">杰郎电器库存管理</h5>
    <div class="button-wrapper">
    </div>
  </div>

  <el-col :style="{ width: isCollapse ? 'auto' : '240px' }">
    <el-menu :default-active="activePath" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
      @close="handleClose" collapse-transition router>
      <el-menu-item index="/home">
        <el-icon><svg t="1753349858357" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="4524" width="200" height="200">
            <path
              d="M969.6 502.4l-118.4-112-323.2-300.8c-9.6-9.6-22.4-9.6-32 0l-313.6 297.6c-3.2 3.2-6.4 6.4-9.6 9.6l-118.4 112c-9.6 9.6-9.6 22.4 0 32s22.4 9.6 32 0l83.2-80 0 393.6c0 48 41.6 89.6 92.8 89.6l83.2 0c38.4 0 70.4-28.8 70.4-67.2l0-217.6 99.2 0 99.2 0 0 217.6c0 35.2 32 67.2 70.4 67.2l83.2 0c51.2 0 92.8-38.4 92.8-89.6l0-396.8 80 73.6c9.6 9.6 22.4 9.6 32 0C979.2 524.8 979.2 512 969.6 502.4zM809.6 857.6c0 25.6-19.2 44.8-44.8 44.8l-83.2 0c-12.8 0-22.4-9.6-22.4-22.4L659.2 640c0-12.8-9.6-22.4-22.4-22.4l-121.6 0-121.6 0c-12.8 0-22.4 9.6-22.4 22.4l0 240c0 12.8-9.6 22.4-22.4 22.4l-83.2 0c-25.6 0-44.8-19.2-44.8-44.8l0-438.4 294.4-281.6 294.4 281.6L809.6 857.6z"
              p-id="4525"></path>
          </svg></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/inbound">
        <el-icon><svg t="1753175629332" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1129" width="200" height="200">
            <path
              d="M1022.074649 809.140491l0-687.493943c0-51.394531-36.133965-88.708368-88.706321-88.708368l-842.73461 0c-63.258743 0-88.709391 27.600615-88.709391 88.708368l0 687.493943c0 46.209438 50.307779 66.530252 88.709391 66.530252l114.106828-0.179079c14.730493 0 18.837021-10.091846 18.837021-20.240997 0-19.490913-8.930393-23.936155-22.059412-23.936155 0 0-87.330998 0-110.884436 0-23.556509 0-44.354184-18.687618-44.354184-44.354184 0-25.663496 0-288.302195 0-288.302195l0-377.013633c0-24.488741 10.004865-44.353161 44.354184-44.353161l842.73461 0c29.897937 0 44.352137 19.86442 44.352137 44.353161l0 665.315828c0 25.604144-17.540492 44.354184-44.352137 44.354184 0 0-95.951329 0-110.886483 0-14.938224 0-21.747303 6.055926-21.747303 25.543769 0 10.149151 11.990079 18.809391 21.747303 18.809391l110.886483 0C979.4519 875.670743 1022.074649 856.888981 1022.074649 809.140491L1022.074649 809.140491z"
              fill="currentColor" p-id="1130"></path>
            <path
              d="M534.033317 254.434853l284.483216 284.48424c8.924253 10.193153 8.16803 20.665669-1.073448 29.907147-9.245572 9.244548-24.721031 9.546424-36.69883-1.51961l-224.533846-224.161363c0 0 0 609.153714 0 620.961644s-6.563486 26.955932-32.621978 26.955932c-26.056446 0-33.909297-12.625552-33.909297-26.955932s0-620.961644 0-620.961644l-221.773989 221.773989c-12.973476 12.269441-26.318412 17.358343-39.781028 3.898797-13.462616-13.465686-3.913123-24.965601 0.876973-31.524994l282.854113-282.857183C518.291798 248.242827 526.732028 248.616334 534.033317 254.434853L534.033317 254.434853z"
              fill="currentColor" p-id="1131"></path>
          </svg></el-icon>
        <span>入库</span>
      </el-menu-item>
      <el-menu-item index="/outbound">
        <el-icon><svg t="1753175660306" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="1279" width="200" height="200">
            <path
              d="M608 960c-4.88 0-9.78-1.11-14.31-3.38A32 32 0 0 1 576 928v-96H416c-17.67 0-32-14.33-32-32V672c0-17.67 14.33-32 32-32h160v-96a32 32 0 0 1 51.2-25.6l256 192c8.06 6.04 12.8 15.53 12.8 25.6s-4.74 19.56-12.8 25.6l-256 192c-5.65 4.23-12.4 6.4-19.2 6.4zM448 768h160c17.67 0 32 14.33 32 32v64l170.67-128L640 608v64c0 17.67-14.33 32-32 32H448v64zM927.98 448c-6.81 0-13.67-2.16-19.49-6.64L512 136.37 115.51 441.36c-14.01 10.78-34.1 8.16-44.88-5.85-10.78-14.01-8.15-34.1 5.85-44.87l416-320c11.5-8.85 27.52-8.85 39.02 0l416 320c14.01 10.78 16.63 30.87 5.85 44.87-6.29 8.19-15.78 12.49-25.37 12.49zM344 720h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10zM344 592h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10z"
              p-id="1280"></path>
            <path
              d="M344 464h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10zM474.5 592h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10zM474.5 464h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10zM605 464h-60c-5.52 0-10-4.48-10-10v-60c0-5.52 4.48-10 10-10h60c5.52 0 10 4.48 10 10v60c0 5.52-4.48 10-10 10z"
              p-id="1281"></path>
            <path
              d="M491 960H192c-17.67 0-32-14.33-32-32V343c0-17.67 14.33-32 32-32s32 14.33 32 32v553h267c17.67 0 32 14.33 32 32s-14.33 32-32 32z"
              p-id="1282"></path>
            <path
              d="M832 574c-17.67 0-32-14.33-32-32V343c0-17.67 14.33-32 32-32s32 14.33 32 32v199c0 17.67-14.33 32-32 32z"
              p-id="1283"></path>
          </svg></el-icon>
        <span>出库</span>
      </el-menu-item>
      <el-menu-item index="/statistics">
        <el-icon>
          <document />
        </el-icon>
        <span>统计查询</span>
      </el-menu-item>
      <el-menu-item index="/setting">
        <el-icon>
          <setting />
        </el-icon>
        <span>设置</span>
      </el-menu-item>
    </el-menu>
  </el-col>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)
const route = useRoute()
const activePath = computed(() => route.path)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.top-container {
  width: auto;
  padding: 16px;
  transition: all 0.3s ease;
}

.top-container.collapsed {
  padding: 8px;
}

.title {
  margin: 0 0 16px 0;
  font-size: 18px;
  line-height: 1;
  transition: all 0.5s;
}

.button-wrapper {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  transition: all 0.3s ease;
}

.toggle-buttons {
  transition: all 0.3s ease;
}

.collapsed .toggle-buttons {
  transform: scale(0.9);
}

.el-col {
  overflow: auto;
}

.el-menu {
  height: calc(100vh - 100px);
  overflow: hidden;
  margin: 0;
  transition: all 0.3s ease;
}
</style>
