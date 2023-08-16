<template>
  <div>
    <h1 class="plugins-tips">
      wangEditor富文本编辑器 访问地址：<a
        href="https://www.wangeditor.com/v5/for-frame.html"
        target="_blank"
        >wangeEitor</a
      >
    </h1>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 55vh; overflow-y: hidden"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
    <el-button type="primary" style="margin-top: 10px" @click="save"
      >保存</el-button
    >
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
export default {
  components: { Editor, Toolbar },
  mounted() {
    this.$axios.get("/api/users");
  },
  data() {
    return {
      editor: null,
      html: "<p>hello</p>",
      toolbarConfig: {},
      editorConfig: { placeholder: "请输入内容..." },
      mode: "default", // or 'simple'
    };
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // 用户点击保存
    save() {
      console.log(this.content);
      console.log(this.html);
      this.$message.success("保存成功！");
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>

