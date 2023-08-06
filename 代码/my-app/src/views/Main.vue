<template>
  <div class="main-container">
    <el-container>
      <el-aside width="auto">
        <!-- 左侧菜单栏组件 -->
        <common-aside></common-aside>
      </el-aside>
      <el-container>
        <el-header>
          <common-header />
        </el-header>
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