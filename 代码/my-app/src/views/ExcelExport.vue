<template>
  <div>
    <!-- 区域1：按钮 -->
    <div class="btn-menu">
      <el-input
        v-model="name"
        ref="inputName"
        placeholder="请输入文件名(默认test)"
      ></el-input>
      <el-button type="primary" size="mini" @click="handleCilckSelect"
        >下载选中内容</el-button
      ><el-button type="primary" size="mini" @click="handleCilck"
        >下载全部</el-button
      >
    </div>
    <!-- 区域2:表格区域 -->
    <div class="table" v-if="tableData.length !== 0">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center">
        </el-table-column>
        <el-table-column
          v-for="item in tableHeaer"
          :key="item"
          :prop="item"
          :label="item"
          align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { read, utils, writeFile } from "xlsx";
export default {
  name: "ExcelFile",
  data() {
    return {
      name: "",
      tableData: [],
      tableHeaer: [],
      // 存储用户选中的数据
      multipleSelection: [],
    };
  },
  mounted() {
    // 表单自动获得焦点
    this.$refs.inputName.focus();
    // 获取数据
    this.$axios.get("/api/company").then((res) => {
      this.tableData = res.data;
      this.tableHeaer = Object.keys(res.data[0]);
    });
  },
  methods: {
    handleSelectionChange(val) {
      // element-ui的selection-change事件:选中的内容发生变化
      // 每次都会返回最新的已选中数据
      this.multipleSelection = val;
    },
    // 下载选中内容
    handleCilckSelect() {
      this.createExcel(this.multipleSelection);
    },
    // 下载全部内容
    handleCilck() {
      this.createExcel(this.tableData);
    },
    // 导出内容为excel
    createExcel(data) {
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new(); // 创建新的工作簿
      utils.book_append_sheet(wb, ws, "sheet1");
      // 浏览器以下载的方式输出wb
      const filename = this.name || "test";
      writeFile(wb, `${filename}.xlsx`);
      // 转换table dom为excel
      // 略
    },
  },
};
</script>

<style lang="less" scoped>
.btn-menu {
  display: flex;
  margin: 10px;
  .el-input {
    width: 300px;
    margin-right: 5px;
  }
}
</style>