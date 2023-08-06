<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 路由匹配的组件将会渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
};
</script>

<style lang="less">
// 注意这里不能添加scoped,因为要全局生效
html,
body {
  margin: 0;
  padding: 0;
}
</style>
