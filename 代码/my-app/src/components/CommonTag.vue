<template>
  <div class="tags">
    <el-tag
      v-for="(item, index) in tabList"
      :key="item.name"
      :closable="item.name !== 'home'"
      :effect="item.name === $route.name ? 'dark' : 'plain'"
      @click="changeMenu(item)"
      @close="handleClose(item, index)"
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "CommonTag",
  data() {
    return {};
  },
  computed: {
    ...mapState("m_tab", ["tabList"]),
  },
  methods: {
    ...mapMutations("m_tab", ["closeTag"]),
    // 点击tag跳转
    changeMenu(item) {
      // 不能跳转到自己
      if (this.$route.name === item.name) return;
      this.$router.push({ name: item.name });
    },
    // 点击tag删除
    handleClose(item, index) {
      const endIndex = this.tabList.length - 1;

      // 跳转逻辑
      // 1. 如果删除tag和不是当前路由
      if (item.name !== this.$route.name) {
        this.closeTag(item);
        return;
      }

      // 2.删除最后一项(且是当前路由)
      if (index === endIndex) {
        this.$router.push(this.tabList[index - 1].name);
      }
      // 删除中间的(且当前路由)
      else {
        this.$router.push(this.tabList[index + 1].name);
      }

      // 删除
      this.closeTag(item);
    },
  },
};
</script>

<style lang='less' sceoped>
.tags {
  margin-bottom: 10px;
  .el-tag {
    margin-right: 10px;
  }
}
</style>