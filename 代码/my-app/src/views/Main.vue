<template>
  <div class="main-container">
    <el-container>
      <!-- 左侧菜单栏 -->
      <el-aside width="auto">
        <common-aside />
      </el-aside>

      <el-container>
        <!-- 头部组件-->
        <el-header>
          <common-header />
        </el-header>

        <!-- 路由区域 -->
        <el-main>
          <!-- 子路由的路由出口 -->
          <!-- 路由匹配的组件将会渲染在这里 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
export default {
  data() {
    return {};
  },
  components: {
    CommonAside,
    CommonHeader,
  },
};
</script>

<style>
/* el-menu会和旁边的盒子有一条缝隙 */
.el-menu {
  border-right: none !important;
}
/*el-header自带padding */
.el-aside {
  width: 200px;
  overflow-y: auto;
}
.el-header {
  padding: 0px;
  height: 61px;
  /* 固定el-header */
  /* overflow-y: auto; */
}
.el-main {
  padding: 16px !important;
  height: calc(100vh - 61px);
  /* 主题区域y轴方向移动 */
  overflow-y: auto;
}
</style>