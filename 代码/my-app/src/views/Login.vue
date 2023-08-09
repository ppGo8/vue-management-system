<template>
  <div class="login-container">
    <el-form
      label-width="70px"
      :inline="true"
      :model="form"
      :rules="rules"
      ref="form"
    >
      <h3 class="login-title">系统登录</h3>

      <el-form-item label="用户名:" prop="username">
        <el-input v-model="form.username" placeholder="请输入账号"> </el-input>
      </el-form-item>

      <el-form-item label="密码:" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
        >
        </el-input>
      </el-form-item>

      <el-button type="primary" @click="onSubmit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import Mock from "mockjs";
import Cookie from "js-cookie";
import { getMenu } from "../api";
export default {
  data() {
    return {
      // 存储用户数据
      form: {
        username: "",
        password: "",
      },
      // 表单数据校验
      rules: {
        username: [
          {
            required: true,
            trigger: "blur", // 触发时机,失去焦点时
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur", // 触发时机,失去焦点时
            message: "请输入密码",
          },
        ],
      },
    };
  },
  methods: {
    // 登录功能
    onSubmit() {
      // 前端手动伪造一个假的token信息
      // const token = Mock.Random.guid(); // 伪token
      // 这里使用js-cookie将token信息存入cookie，用于不同页面间的通信
      // 也可以使用本地存储;二者都在在浏览器的application下查看
      //  Cookie.set("token", token);

      // 校验通过
      this.$refs.form.validate((valid) => {
        // 用户输入数据通过前端校验
        if (valid) {
          getMenu(this.form).then(({ data }) => {
            // 业务状态码,返回20000代表成功
            if (data.code === 20000) {
              // 存储后端返回的token
              Cookie.set("token", data.data.token);

              // 获取菜单的数据,存储store中
              this.$store.commit("m_tab/setMenu", data.data.menu);

              // 获取后端返回的路由,动态设置路由
              this.$store.commit("m_tab/addMenu", this.$router);

              // 编程式跳转到首页
              this.$router.push("/home");
            } else {
              // 登录失败要给一个友好的提示
              this.$message.error(data.data.message);
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  box-sizing: border-box;
  width: 350px;

  margin: 180px auto;
  padding: 35px;

  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .login-title {
    text-align: center;
    // margin-bottom: 40px;
    color: #505458;
  }
  .el-form-item {
    display: flex;
  }
  .el-input {
    width: 198px;
  }
  .el-form:nth-child(1) {
    margin-bottom: 45px;
  }
  ::v-deep .el-button {
    position: absolute;
    left: 50%;
    bottom: 5%;
    // CSS3提供的方法
    // 由于不知道盒子自身的大小,没办法使用margin-left=-1/2*宽度
    transform: translateX(-50%);
  }
}
</style>