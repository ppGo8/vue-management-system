<template>
  <div class="main-container">
    <!-- 左侧区域：菜单栏 -->
    <el-container>
      <!-- 菜单栏组件 -->
      <el-aside width="auto">
        <common-aside />
      </el-aside>

      <!-- 右侧区域：头部和路由 -->
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
.el-header {
  padding: 0px;
}
</style>