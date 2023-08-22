<template>
  <div>
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <h3>{{ isCollapse ? "后台" : "通用后台管理系统" }}</h3>
      <!-- <h3 v-if="isCollapse">后台</h3>
      <h3 v-else>通用后台管理系统</h3> -->

      <!-- 只有一级栏目菜单 -->
      <el-menu-item
        :index="item.path"
        v-for="item in noChildren"
        :key="item.name"
        @click="ClickMenu(item)"
      >
        <!-- i标签:前面渲染渲染的图标;修改class类型就对应不同的图标 -->
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>

      <!-- 有二级栏目的菜单 -->
      <el-submenu
        :index="item.label"
        v-for="item in hasChildren"
        :key="item.label"
      >
        <template slot="title">
          <i :class="`el-icon-${item.icon}`"></i>
          <span slot="title">{{ item.label }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item-group
          v-for="subItem in item.children"
          :key="subItem.name"
        >
          <el-menu-item
            :index="subItem.path"
            @click="ClickMenu(subItem, item)"
            >{{ subItem.label }}</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>

export default {
  data() {
    return {};
  },
  methods: {
    // 点击菜单事件
    ClickMenu(item) {
      // 编程实现页面路由跳转
      if (
        this.$route.path !== item.path &&
        !(this.$route.path === "/home" && item.path === "/")
      ) {
        this.$router.push(item.path).catch((err) => {
          console.log(err);
        });
      }
      // 处理tag
      this.$store.commit("m_tab/selectMenu", item);
      // 处理面包屑
      this.$store.commit("m_bread/setbreadList", arguments);
    },
  },
  computed: {
    // 高亮的菜单
    activeMenu() {
      return this.$route.path;
    },
    // 没有子菜单
    noChildren() {
      return this.menuData.filter((item) => !item.children);
    },
    // 有子菜单
    hasChildren() {
      return this.menuData.filter((item) => item.children);
    },
    // 使用store中的state的属性
    // ...mapState("m_tab", ["isCollapse"]),
    isCollapse() {
      return this.$store.state.m_tab.isCollapse;
    },
    // 不同用户显示的不同菜单
    menuData() {
      // store中的数据可能由于刷新丢失了;所以优先从本地存储汇总获得
      return (
        JSON.parse(localStorage.getItem("menu")) || this.$store.state.m_tab.menu
      );
    },
  },
};
</script>


<style lang='less' scoped>
// 需要保留,没有这个菜单栏的展开和收缩会不自然
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.el-menu {
  height: 100vh;

  h3 {
    color: #fff;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>