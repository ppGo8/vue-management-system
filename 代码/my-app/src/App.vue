<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 路由匹配的组件将会渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
import Cookie from "js-cookie";
import jwt_decode from "jwt-decode";
export default {
  name: "App",
  components: {},
  created() {
    // 防止刷新导致Vuex中用户的登录信息丢失
    if (Cookie.get("token")) {
      const decoded = jwt_decode(Cookie.get("token"));
      this.$store.dispatch("m_admin/setAuthenticated", !this.isEmpty(decoded));
      this.$store.dispatch("m_admin/setUser", decoded);
    }
    
  },
  methods: {
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
  },
};
</script>

<style lang="less">
// 注意这里不能添加scoped,因为要全局生效
html,
body,
p {
  margin: 0;
  padding: 0;
}
</style>
