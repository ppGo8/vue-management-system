<template>
  <div class="login-container">
    <el-form
      label-width="70px"
      :inline="true"
      :model="form"
      :rules="rules"
      ref="form"
      @keyup.enter.native="onSubmitKeyup"
    >
      <h3 class="login-title">系统登录</h3>

      <el-form-item label="用户名:" prop="name">
        <el-input v-model="form.name" placeholder="请输入账号"> </el-input>
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
import Cookie from "js-cookie";
import jwt_decode from "jwt-decode";

export default {
  data() {
    return {
      // 存储用户数据
      form: {
        name: "",
        password: "",
      },
      // 表单数据校验
      rules: {
        name: [
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
    // 检验数据是否为空,为空返回true
    isEmpty(value) {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    },
    // 按下回车
    onSubmitKeyup() {
      this.onSubmit();
    },
    // 登录功能
    onSubmit() {
      // 检验用户输入的信息
      this.$refs.form.validate((valid) => {
        // 用户输入通过前端校验
        if (valid) {
          this.$axios
            .post("/api/admin/login", this.form)
            .then((res) => {
              if (res.status === 200) {
                console.log("@执行了then");
                console.log("@登陆成功返回的数据:", res);
                // 使用cookie存储token,也可以使用本地存储
                const { token } = res.data;
                Cookie.set("token", token);
                // 存储到Vuex:菜单数据
                this.$store.commit("m_tab/setMenu", res.data.menu);
                // 存储到Vuex:路由数据
                this.$store.commit("m_tab/addMenu", this.$router);

                // 解析token
                const decoded = jwt_decode(token);
                console.log("@解析token", decoded);
                // 存储到Vuex:是否授权和登录用户的信息
                this.$store.dispatch(
                  "m_admin/setAuthenticated",
                  !this.isEmpty(decoded)
                );
                this.$store.dispatch("m_admin/setUser", decoded);

                // 编程式跳转到首页
                this.$router.push("/home");
              }
            })
            .catch((err) => {
              console.log("发生了错误", err);
              // 登录失败提示
              this.$message.error(err.response.data);
            });
        } else {
          return this.$message("输入数据格式不正确,请重新输入!");
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