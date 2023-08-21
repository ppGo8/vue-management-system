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
  name: "CommonTab",
  data() {
    return {};
  },
  computed: {
    ...mapState("m_tab", ["tabList"]),
  },
  methods: {
    ...mapMutations("m_tab", ["closeTab"]),
    ...mapMutations("m_bread", ["setBreadListTab"]),
    // 点击tab跳转
    changeMenu(item) {
      // 不能跳转到自己
      if (this.$route.name === item.name) return;
      this.setBreadListTab(item);
      this.$router.push({ name: item.name });
    },
    // 点击tab删除
    handleClose(item, index) {
      const endIndex = this.tabList.length - 1;

      // 跳转逻辑
      // 1. 如果删除tab和不是当前路由
      if (item.name !== this.$route.name) {
        this.closeTab(item);
        return;
      }

      // 2.删除最后一项(且是当前路由)
      if (index === endIndex) {
        // 传递给breadlist
        this.setBreadListTab(this.tabList[index - 1]);
        this.$router.push(this.tabList[index - 1].name);
      }
      // 删除中间的(且当前路由)
      else {
        this.setBreadListTab(this.tabList[index + 1]);
        this.$router.push(this.tabList[index + 1].name);
      }

      // 删除
      this.closeTab(item);
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