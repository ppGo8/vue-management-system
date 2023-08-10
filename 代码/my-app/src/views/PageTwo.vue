<template>
  <div>
    <h1 class="plugins-tips">
      Markdonw编辑器v-md-editor 访问地址：<a
        href="https://imzbf.github.io/md-editor-v3/en-US/index"
        target="_blank"
        >v-md-editor</a
      >
    </h1>
    <v-md-editor v-model="text" style="min-height: 60vh"></v-md-editor>
    <el-button type="primary" style="margin-top: 10px" @click="save"
      >保存</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  methods: {
    // 用户点击保存
    save() {
      console.log(this.text);
      this.$message.success("保存成功！");
    },
  },
};
</script>

<style>
.v-md-editor {
  overflow: hidden;
}
</style>