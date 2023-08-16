<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <h1 class="title">通用后台管理系统</h1>
      </div>

      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        label-width="80px"
        class="registerForm"
        @keyup.enter.native="onSubmitKeyup"
      >
        <el-form-item label="用户名" prop="name">
          <el-input
            v-model="registerForm.name"
            placeholder="请输入用户名"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-select v-model="registerForm.identity" placeholder="请选择身份">
            <el-option label="管理员" value="admin"> </el-option>
            <el-option label="员工" value="employ"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="submit_btn"
            @click="submitForm(registerForm)"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    // 需要在data中调用的方法,定义在此处
    // 验证两个密码是否输入一致
    const validatePass2 = (rules, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        password: "",
        confirmPassword: "",
        identity: "",
      },
      // 表单信息验证规则
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
          {
            min: 2,
            max: 30,
            message: "长度要在2-30个字符之间",
            trigger: "blur",
          },
          ,
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30个字符",
            trigger: "blur",
          },
        ],
        confirmPassword: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          {
            min: 6,
            max: 30,
            message: "长度在6到30个字符",
            trigger: "blur",
          },
          {
            // 验证两次密码是否一致
            validator: validatePass2,
            // 确认密码这里用change更合理
            trigger: "blur",
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    // 按回车键
    onSubmitKeyup() {
      this.submitForm();
    },
    submitForm() {
      // 验证输入信息的有效性
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.$axios
            .post("/api/admin/register", this.registerForm)
            .then((res) => {
              if (res.data.status === 200) {
                this.$message.success(
                  res.data.message + ",即将自动跳转到登录页..."
                );
                // 跳转到登录页
                setTimeout(() => {
                  this.$router.push("/login");
                }, 3000);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch((err) => {
              this.$message.error(err.response.data);
            });
        } else {
          return this.$message.error("输入信息有误 请修改信息重新注册");
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;

  .form_container {
    width: 420px;
    height: 210px;
    position: absolute;

    padding: 25px;
    border-radius: 5px;
    text-align: center;
    left: 48%;
    transform: translateX(-50%);
    top: 30%;
    opacity: 0.8;

    .manage_tip {
      .title {
        text-align: center;
      }
    }

    .el-form {
      margin-top: 20px;
      padding: 35px 35px 20px 4px;
      border-radius: 5px;
      box-shadow: 0px 5px 10px #cccc;

      ::v-deep .el-input__inner {
        width: 95%;
      }
      :deep(.el-form-item__label) {
        line-height: 24px;
        font-size: 14px;
        color: black;
        padding-top: 5px;
      }

      :deep(.el-input__wrapper) {
        background-color: rgb(94, 90, 90);
        .el-input__inner {
          color: #fff;
          padding: 20px 0;
        }
      }

      .el-button {
        width: 100%;
        margin-left: -50px;
      }
    }
  }
}
</style>