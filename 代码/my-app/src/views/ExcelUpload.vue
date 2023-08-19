<template>
  <div>
    <!-- 区域1:上传文件 -->
    <div class="file">
      <input
        type="file"
        accept=".xlsx, .xls"
        ref="excel-upload-input"
        class="excel-upload-input"
        @change="handleAddFile"
      />
      <div
        class="drop"
        @drop="handleDrop"
        @dragover="handleDragover"
        @dragenter="handleDragover"
        @dragleave="handleDragover"
      >
        将文件拖到此处 或
        <el-button type="primary" size="mini" @click="handleClick"
          >点击上传</el-button
        >
      </div>
    </div>

    <!-- 区域2:展示表格 -->
    <div ref="table" class="table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
import { read, writeFile, utils } from "xlsx";
export default {
  name: "ExcelFile",
  data() {
    return {
      excelhtml: "",
      excelSrc: "",
      tableData: [],
      tableHeader: [],
    };
  },
  methods: {
    // 点击上传文件按钮
    handleClick() {
      // 编程式触发input的点击事件
      this.$refs["excel-upload-input"].click();
    },
    // 用户点击添加文件
    handleAddFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      // 注意:上传重复文件不触发chage事件,因此再得到file对象后,需要将input对象的value清空
      this.$refs["excel-upload-input"].value = null;

      // 文件大于1M,则取消上传
      if (file.size >= 1024 * 1024) {
        return this.$message.warning("请勿上传大于1M的文件!");
      }
      // 上传文件
      this.upload(file);
    },
    // 取消除了drop外其他拖拽事件的默认行为
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    handleDrop(e) {
      e.stopPropagation();
      e.preventDefault();

      // if(this.loading) return this.$message.warning('请等待当前excel解析完毕!')
      // dataTransfer对象获得有关拖拽的内容信息
      const files = e.dataTransfer.files;
      if (files.length !== 1) {
        return this.$message.warning("仅支持上传一个文件!");
      }

      const rawFile = files[0];
      if (!this.isExcel(rawFile)) {
        return this.$message.error("仅支持excel类型文件");
      }
      this.upload(rawFile);
      e.stopPropagation();
      e.preventDefault();
    },

    // 解析文件为json或html
    upload(file) {
      if (!file) return;
      file.arrayBuffer().then((res) => {
        const workbook = read(res);
        const sheet1 = workbook.Sheets.Sheet1;
        const _data = utils.sheet_to_json(sheet1);
        // const _html = utils.sheet_to_html(sheet1); // 转换成直接在Html中显示的表格
        // 获得表头;使用el-table时会使用到
        this.tableData = _data;
        this.tableHeader = Object.keys(_data[0]);
      });
    },
    // 判断文件是否为excel类型
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name);
    },
  },
};
</script>

<style lang="less" scoped >
.excel-upload-input {
  display: none;
  z-index: -999;
}
.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 15px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}
.table {
  margin: 20px;
}
</style>