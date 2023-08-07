<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="item in tabList"
      :key="item.name"
      :to="{ path: item.path }"
      >{{ item.label }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("m_tab", ["tabList"]),
  },
};
</script>

<style lang="less">

</style>