<template>
  <div class="infoshow">
    <!-- 一行两列 -->
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :sapn="8">
        <div class="user">
          <img src="../assets/images/user.jpg" alt="" class="avatar" />
        </div>
      </el-col>
      <el-col :sapn="16">
        <div class="userinfo">
          <div class="user-item">
            <i class="el-icon-user-solid"></i>
            <span>{{ user.name }}</span>
          </div>
          <div class="user-item">
            <i class="el-icon-s-tools"></i>
            <span>{{ user.identity == "admin" ? "管理员" : "普通员工" }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "infoshow",
  mounted() {
    console.log(this.$store.getters["m_admin/user"]);
  },
  computed: {
    user() {
      return this.$store.getters["m_admin/user"];
    },
  },
};
</script>

<style lang="less" scoped>
.infoshow {
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  .row-bg {
    width: 100%;
    height: 100%;
  }
  .user {
    text-align: center;
    position: relative;
    top: 30%;

    img {
      width: 150px;
      border-radius: 50%;
    }
  }
}

.userinfo {
  height: 100%;
  width: 100%;
  padding: 12px;
  border-left: 1px solid #eee;
  //   background-color: #eee;

  .user-item {
    position: relative;
    top: 35%;
    padding: 5px;
    font-size: 28px;
    color: #333;
  }

  i,
  span {
    margin-right: 10px;
    line-height: 20px;
    font-size: 20px;
    font-weight: bold;
  }
}
</style>