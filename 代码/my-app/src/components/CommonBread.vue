<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.label">
      <!-- 一级菜单 -->
      <!-- !item.path:二级菜单的一级菜单,没有路由所以用span显示 -->
      <!-- index === breadList.length - 1:面包屑的最后一个内容,及当前路径不能跳转-->
      <span
        v-if="!item.path || index === breadList.length - 1"
        class="no-redirect"
        >{{ item.label }}</span
      >
      <a v-else @click.prevent="handleClick(item)" class="redirect">{{
        item.label
      }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState("m_bread", ["breadList"]),
  },
  methods: {
    ...mapMutations("m_bread", ["clearBreaList"]),
    handleClick(item) {
      // 跳转前修改存储的面包屑数据
      this.clearBreaList();
      // 跳转
      this.$router.push({ name: item.name });
    },
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .redirect {
    color: #fff;
  }
  .no-redirect {
    color: #d3d3d3;
    cursor: text;
  }
}
</style>