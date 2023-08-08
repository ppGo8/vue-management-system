<template>
  <div class="manage">
    <!-- 区域1：新增按钮和搜索区域-->
    <div class="manage-header">
      <!-- 1.新增按钮 -->
      <el-button type="primary" @click="handleAdd"> + 新增 </el-button>
      <!-- 2.form搜索区域 -->
      <el-form :model="userForm" :inline="true">
        <el-form-item>
          <el-input placeholder="请输入名称" v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 区域2：弹出的提示框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="50%"
    >
      <!-- 2.1用户的表单信息 -->
      <el-form
        :rules="rules"
        ref="form"
        :model="form"
        label-width="80px"
        :inline="true"
      >
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input placeholder="请输入年龄" v-model="form.age"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" :value="0"></el-option>
            <el-option label="女" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期" prop="birth">
          <el-date-picker
            v-model="form.birth"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="地址" prop="addr">
          <el-input placeholder="请输入地址" v-model="form.addr"></el-input>
        </el-form-item>
      </el-form>
      <!-- 2.2确定和取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <!-- 用户点击确定 -->
        <el-button type="primary" @click="submitHandler">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 区域3：表格 -->
    <div class="common-table">
      <!-- 第一部分:表格 -->
      <el-table :data="tableData" stripe style="width: 100%" height="90%">
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.sex === 0 ? "男" : "女"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄"> </el-table-column>
        <el-table-column prop="birth" label="出生日期"> </el-table-column>
        <el-table-column prop="addr" label="地址"> </el-table-column>
        <el-table-column prop="addr" label="编辑">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              @click="handleDelete(scope.row)"
              type="danger"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 第二部分:分页器 -->
      <div class="pager">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          @current-change="handlePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, addUser, editUser, delUser } from "../api";
export default {
  data() {
    return {
      // 是否显示表单
      dialogVisible: false,
      form: {
        name: "",
        age: "",
        sex: "",
        birth: "",
        addr: "",
      },
      // 表单数据检查约束规则
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
          },
        ],
        age: [
          {
            required: true,
            message: "请输入年龄",
          },
        ],
        sex: [
          {
            required: true,
            message: "请输入性别",
          },
        ],
        birth: [
          {
            required: true,
            message: "请输入出生日期",
          },
        ],
        addr: [
          {
            required: true,
            message: "请输入地址",
          },
        ],
      },
      // 表单数据
      tableData: [],
      // 区分表单弹窗：0表示新增弹窗; 1表示编辑
      modalType: 0, // 默认是新增弹窗
      // 用户列表数据总条数,
      total: 0, // 默认为0
      pageData: {
        page: 1,
        limit: 10,
      },
      // 用户管理页面 搜索
      userForm: {
        name: "",
      },
    };
  },
  mounted() {
    // 页面首次加载时,获得用户列表数据
    this.getList();
  },

  methods: {
    // 点击新增
    handleAdd() {
      // 这是一个"新增"的弹窗
      this.modalType = 0;
      // 打开弹窗
      this.dialogVisible = true;
    },
    // 点击确定按钮,表单
    submitHandler() {
      // element-ui提交的表单是否通过校验的方法
      // valid的值为true,通过校验;值为false,未通过校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 后续对数据的处理
          if (this.modalType === 0) {
            addUser(this.form).then(() => {
              // 重新获取列表接口
              this.getList();
            });
          } else {
            // 调用编辑接口
            editUser(this.form).then(() => {
              // 重新获取列表接口
              this.getList();
            });
          }

          // 关闭表单的操作
          this.handleClose();
        }
      });
    },
    // 表单关闭时
    handleClose() {
      // 关闭表单
      this.dialogVisible = false;
      // 清空表单历史数据
      this.$refs.form.resetFields();
    },
    // 点击取消按钮
    cancel() {
      this.handleClose();
    },
    // 点击编辑按钮
    handleEdit(row) {
      // 打开的弹窗是编辑弹窗
      this.modalType = 1;
      // 打开弹窗
      this.dialogVisible = true;
      // 显示该行数据到弹窗上；注意使用深拷贝
      // 不使用深拷贝的话,修改了内容又点击了取消编辑原数据还是会修改
      this.form = JSON.parse(JSON.stringify(row));
    },
    // 点击删除按钮
    handleDelete(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除数据一般使用id作为表示
          delUser({ id: val.id }).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 重新获取接口
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分页器数据发生变化
    handlePage(val) {
      // 修改data的值
      this.pageData.page = val;
      // 重新请求列表数据
      this.getList();
    },
    // 字符串搜索功能
    onSubmit() {
      this.getList();
    },

    // 封装公共方法：获取列表数据
    getList() {
      // 请求列表数据时,传递页码和页数
      getUser({ params: { ...this.pageData, ...this.userForm } }).then(
        ({ data }) => {
          console.log(data);
          this.tableData = data.list;
          // this.total = data.list.length || 0; //这个是当前返回的数据的条数,一般只返回一部分(一页),请求更多数据时再返回其他的

          // 后端提供了用户数据的总长度
          this.total = data.count || 0;
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.manage {
  height: 90%;
  .manage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .common-table {
    height: calc(100% - 62px);
    position: relative;
    .pager {
      position: absolute;
      bottom: 0;
      right: 20px;
    }
  }
}
</style>