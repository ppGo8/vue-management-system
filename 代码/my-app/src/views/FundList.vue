<template>
  <div class="fillcontain">
    <!-- 按钮区域:筛选、添加 -->
    <div class="btn">
      <!-- 按日期筛选区域 -->
      <el-form :inline="true" ref="search_data" :model="search_data">
        <el-form-item label="按照时间筛选:">
          <el-date-picker
            v-model="search_data.startTime"
            type="date"
            placeholder="选择开始时间"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="search_data.endTime"
            type="date"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleSearch()"
            >筛选</el-button
          >
        </el-form-item>

        <el-form-item class="btnAdd">
          <el-button type="primary" icon="view" @click="onAddMoney"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 区域2:资金流水表格 -->
    <div class="table-container">
      <el-table
        v-if="tableData.length > 0"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="50">
        </el-table-column>
        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="150"
          sortable
        >
          <template slot-scope="scope">
            <el-icon name="time"></el-icon>
            <span style="margin-left: 10px">{{
              scope.row.date.substring(0, 10)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="收支描述"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="100">
          <template slot-scope="scope">
            <span style="color: #00d053">+ {{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="expenditure"
          label="支出"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color: #f56767">- {{ scope.row.expenditure }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="account"
          label="账户现金"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <span style="color: #4db3ff">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="200">
        </el-table-column>
        <el-table-column
          prop="operation"
          align="center"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-button
              type="warning"
              icon="deit"
              size="mini"
              :disabled="user.identity !== 'admin' ? true : false"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              icon="delete"
              type="danger"
              :disabled="user.identity !== 'admin' ? true : false"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total"
            >
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog.vue";
export default {
  name: "fundList",
  components: {
    Dialog,
  },
  computed: {
    user() {
      return this.$store.getters["m_admin/user"];
    },
  },
  data() {
    return {
      // 筛选时间
      search_data: {
        startTime: "",
        endTime: "",
      },
      // 表格数据,从父级传递给子组件
      formData: {
        type: "",
        description: "",
        income: "",
        expenditure: "",
        account: "",
        remark: "",
        id: "",
      },
      // 前端展示的当前页数据
      tableData: [],
      // 后端传过来的全部数据
      allTableData: [],
      // 后端传过来的数据,用来日期筛选
      filterTableData: [],
      // 控制对话框显示的数据
      dialog: {
        show: false,
        title: "",
        option: "edit",
      },
      // 需要给分页组件传的信息
      paginations: {
        page_index: 1, // 当前页码
        total: 0, // 总条数
        page_size: 5, // 页码大小:每页显示多少条数据
        page_sizes: [5, 10, 15, 20], // 可供选择页码大小数组
        layout: "total, sizes, prev, pager, next, jumper", // 翻页属性
      },
    };
  },
  created() {
    // 加载数据
    this.getProfile();
  },
  methods: {
    // 获取表格数据
    getProfile() {
      this.$axios
        .get("/api/funds")
        .then((res) => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          // 设置分页数据
          this.setPaginations();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 按日期筛选
    handleSearch() {
      if (!this.search_data.startTime || !this.search_data.endTime) {
        this.$message.warning("请选择时间区间");
        this.getProfile();
        return;
      }
      const stime = this.search_data.startTime.getTime();
      const etime = this.search_data.endTime.getTime();

      // let table = [];
      // for (let i = 0; i < this.filterTableData.length; i++) {
      //   let date = new Date(this.filterTableData[i].date.substring(0, 10));
      //   let time = date.getTime();
      //   if (time >= stime && time <= etime) {
      //     table.push(this.filterTableData[i]);
      //   }
      // }
      // this.allTableData = table;

      this.allTableData = this.filterTableData.filter((item) => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= stime && time <= etime;
      });
      // 重新获取分页数据（筛选日期后数据的分页数据）
      this.setPaginations();
    },
    // 新增信息
    onAddMoney() {
      this.dialog = {
        show: true,
        title: "添加资金信息",
        option: "add",
      };
      // 新增弹窗数据赋值为空
      this.formData = {
        type: "",
        description: "",
        income: "",
        expenditure: "",
        account: "",
        remark: "",
        id: "",
      };
    },
    // 编辑信息
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit",
      };
      // 让弹框显示表格的内容
      this.formData = {
        type: row.type,
        description: row.description,
        income: row.income,
        expenditure: row.expenditure,
        account: row.account,
        remark: row.remark,
        id: row.id,
      };
    },
    // 删除信息
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(`/api/funds/${row.id}`)
            .then((res) => {
              this.$message.success("删除成功");
              // 刷新界面,重新加载数据
              this.getProfile();
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 设置分页数据
    setPaginations() {
      // 设置分页属性(初始化设置)
      this.paginations.total = this.allTableData.length;
      this.paginations.page_index = 1;
      this.paginations.page_size = 5;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    // 页码大小(每页显示的条数)改变
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1;
      this.paginations.page_size = page_size;
      // 设置默认的分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    // 页码改变
    handleCurrentChange(page) {
      // 即将跳转到page页,获取page页第一条数据在所有数据中的下标
      const startIndex = this.paginations.page_size * (page - 1);
      // 即将跳转到page页,获取(page+1)页第一条数据在所有数据中的下标
      const endIndex = this.paginations.page_size * page;
      // 容器
      const tables = [];

      // 筛选page页的数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < endIndex && index >= startIndex;
      });
      //   for (let i = startIndex; i < endIndex; i++) {
      //     // if判断是否存在数据(分页的最后一页可能会存在没有数据的情况)
      //      if (this.allTableData[i]) {
      //       tables.push(this.allTableData[i]);
      //     }
      //     this.tableData = tables;
      //   }
    },
  },
};
</script>

<style lang="less" scoped>
.fillcontain {
  width: 100%;
  height: 80%;
  // overflow: auto;
  padding: 5px;
  box-sizing: border-box;

  /*列表区域滚动显示 */
  ::v-deep .el-table__body-wrapper {
    height: 55vh;
    overflow: auto;
  }
  .btnAdd {
    overflow: hidden;
    float: right;
  }
  /* 分页器 */
  .pagination {
    text-align: right;
    margin-right: 20px;
    margin-top: 10px;
  }
}
</style>