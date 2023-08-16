<template>
  <div class="header-container">
    <div class="l-content">
      <el-button
        @click="handleMenu"
        icon="el-icon-menu"
        size="mini"
      ></el-button>
      <!-- 面包屑区域 -->
      <span class="bread-text"> <CommonBread /> </span>
    </div>
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <!-- ../是父级目录,./是当前文件所在目录 -->
          <img class="user" src="../assets/images/user.jpg" alt="" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="showinfo">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
          <!-- <el-dropdown-item disabled>双皮奶</el-dropdown-item> -->
          <!-- <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import CommonBread from "@/components/CommonBread.vue";
import Cookie from "js-cookie";
export default {
  components: {
    CommonBread,
  },
  methods: {
    // 点击菜单栏
    // ...mapMutations('m_tab',['collapseMenu']),
    handleMenu() {
      this.$store.commit("m_tab/collapseMenu");
    },
    // 进入个人中心
    showinfo() {
      if (this.$route.name !== "infoshow") {
        this.$router.push("/infoshow");
      }
    },
    // 用户退出
    logout() {
      // 清除cookie中的token
      Cookie.remove("token");
      // 清除本地存储中的menu
      localStorage.removeItem("menu");
      // 编程式跳转到登录页面
      this.$router.push("/login");
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
  .r-content {
    .user {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }
  .l-content {
    display: flex;
    align-items: center;
    color: #fff;
    .el-button {
      margin-right: 20px;
    }
    // 这些样式是通过在浏览器处检查得到的
    ::v-deep .el-breadcrumb {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          font-weight: 400;
          &.is-link {
            color: #666;
          }
        }
        // ？last-child
        &:last-child {
          .el-breadcrumb__inner {
            &.is-link {
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>

