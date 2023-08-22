<template>
  <div>
    <h1 class="plugins-tips">
      Markdonw编辑器v-md-editor 访问地址：<a
        href="https://imzbf.github.io/md-editor-v3/en-US/index"
        target="_blank"
        >v-md-editor</a
      >
    </h1>
    <v-md-editor v-model="text" style="min-height: 55vh"></v-md-editor>
    <el-button type="primary" style="margin-top: 10px" @click="save"
      >保存</el-button
    >
  </div>
</template>

<script>
import Vue from "vue";
// v-md-editor编辑器
import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";

// v-md-editor 代码块关键字高亮
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
// 引入所有语言包
import { hljs } from "highlight.js";
VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs,
});
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
Vue.use(VueMarkdownEditor);


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