<template>
  <div class="header-container">
    <div class="l-content">
      <el-button
        @click="handleMenu"
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- 面包屑区域 -->
      <span class="bread-text">首页</span>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- ../是父级目录,./是当前文件所在目录 -->
          <img class="user" src="../assets/images/user.jpg" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>退出</el-dropdown-item>
          <!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item> -->
          <!-- <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  methods: {
    // 点击菜单栏
    // ...mapMutations('m_tab',['collapseMenu']),
    handleMenu() {
      this.$store.commit("m_tab/collapseMenu");
    },
  },
};
</script>

<style lang="less" scoped>
.header-container {
  padding: 0 20px;
  display: flex;
  justify-content: space-between; // 水平两端对齐
  align-items: center; // 垂直居中对齐
  height: 60px;
  background-color: #333;

  .bread-text {
    color: white;
    font-size: 14px;
    margin: 10px;
  }
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>

