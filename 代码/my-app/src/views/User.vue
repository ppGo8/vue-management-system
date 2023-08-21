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
    <!-- :before-close="handleClose" -->
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
          <el-input
            placeholder="请输入年龄"
            v-model.number="form.age"
          ></el-input>
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
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="50"
        ></el-table-column>

        <el-table-column prop="name" label="姓名" center> </el-table-column>
        <el-table-column prop="sex" label="性别" center>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              Number(scope.row.sex) === 0 ? "男" : "女"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="age" label="年龄" center> </el-table-column>
        <el-table-column prop="birth" label="出生日期" center>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.birth.substr(0, 10)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="addr" label="地址" center> </el-table-column>
        <el-table-column prop="edit" label="编辑">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" type="warning"
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
import qs from "qs";

export default {
  data() {
    return {
      // 是否显示表单
      dialogVisible: false,
      form: {
        // 后端会传过来id
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
          {
            type: "number",
            message: "请输入数字",
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
        pageNum: 1,
        pageSize: 10,
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
      // 恢复到表单的初始状态
      this.$nextTick(() => {
        // 需要放在下一轮操作,等到弹窗显示出来后才更新
        this.$refs["form"].resetFields();
      });
    },
    // 点击确定按钮,表单
    submitHandler() {
      // element-ui提交的表单是否通过校验的方法
      // valid的值为true,通过校验;值为false,未通过校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 后续对数据的处理
          if (this.modalType === 0) {
            this.$axios
              .post("/api/users", qs.stringify(this.form), {
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
              })
              .then((res) => {
                console.log(res);
                // 重新获取列表接口
                this.getList();
              });
          } else {
            // 调用编辑接口
            this.$axios
              .put(`/api/users/${this.form.id}`, qs.stringify(this.form))
              .then((res) => {
                console.log(res);
                this.$message.success("数据编辑成功");
              })
              .catch((err) => {
                console.log(err);
              });
          }
          // 重新获取列表接口
          this.getList();

          // 关闭表单的操作
          this.handleClose();
        }
      });
    },
    // 关闭弹窗框
    handleClose(done) {
      // 关闭表单
      this.dialogVisible = false;
      // 因为编辑和新增共用一个弹窗,如果在此处使用 this.$refs["form"].resetFields();
      // 那么编辑点击关闭弹窗时，就会在瞬间闪屏为 空；但是业务逻辑应该是子弹窗上保持着用户的数据
      // 因此应该只在新增弹框打开时重置数据为空状态;
      // 为了保持表单一开始的状态为空,需要在将编辑修改的数据放入nextTick中；
      // 避免第一个编辑的数据成为表单初始状态
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
      // 深拷贝：显示该行数据到弹窗上
      // 如果使用深拷贝修改了内容又点击了取消编辑原数据还是会修改
      this.$nextTick(() => {
        this.form = JSON.parse(JSON.stringify(row));
        this.form.sex = Number(this.form.sex) === 0 ? "男" : "女";
      });
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
          this.$axios.delete(`/api/users/${val.id}`).then(() => {
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
      this.pageData.pageNum = val;
      // 重新请求列表数据
      this.getList();
    },
    // 字符串搜索功能
    onSubmit() {
      this.getList();
    },

    // 封装公共方法：获取列表数据
    getList() {
      this.$axios
        .get("/api/users", { params: { ...this.pageData, ...this.userForm } })
        .then((data) => {
          this.tableData = data.data.list;
          // 后端提供了用户数据的总长度
          this.total = data.data.count || 0;
        })
        .catch((err) => {
          console.log(err);
        });
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