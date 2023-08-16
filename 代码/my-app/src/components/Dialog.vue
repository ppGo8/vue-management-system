<template>
  <div class="dialog">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="true"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <!-- 弹出的表单内容 -->
      <div class="form">
        <el-form
          ref="form"
          :rules="from_rules"
          :model="formData"
          label-width="120px"
          style="margin: 10px; width: auto"
        >
          <el-form-item label="收支类型:">
            <el-select v-model="formData.type" placeholder="收支类型">
              <el-option
                v-for="(formtype, index) in format_type_list"
                :key="index"
                :label="formtype"
                :value="formtype"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item prop="description" label="收支描述:">
            <el-input
              type="description"
              v-model="formData.description"
            ></el-input>
          </el-form-item>

          <el-form-item prop="income" label="收入:">
            <el-input type="income" v-model="formData.income"> </el-input>
          </el-form-item>

          <el-form-item prop="expenditure" label="支出:">
            <el-input
              type="expenditure"
              v-model="formData.expenditure"
            ></el-input>
          </el-form-item>

          <el-form-item prop="account" label="账户现金:">
            <el-input type="account" v-model="formData.account"></el-input>
          </el-form-item>

          <el-form-item label="备注:">
            <el-input type="textarea" v-model="formData.remark"></el-input>
          </el-form-item>

          <el-form-item class="text_right">
            <el-button @click="dialog.show = false">取消</el-button>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "Dialog",
  // 父组件传值接受数据
  props: {
    dialog: Object,
    formData: Object,
  },
  data() {
    return {
      // type的类型
      format_type_list: [
        "提现",
        "提现手续费",
        "充值",
        "优惠券",
        "充值礼券",
        "转账",
      ],
      // 表单校验规则
      from_rules: {
        description: [
          { required: true, message: "收支描述不能为空！", trigger: "blur" },
        ],
        income: [
          { required: true, message: "收入不能为空！", trigger: "blur" },
          // { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
        expenditure: [
          { required: true, message: "支出不能为空！", trigger: "blur" },
          // { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
        account: [
          { required: true, message: "账户不能为空！", trigger: "blur" },
          // { type: "number", message: "必须为数字值", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 点击确认按钮
    onSubmit(form) {
      // 表单验证
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.dialog.option === "add") {
            // 添加数据
            this.$axios
              .post("/api/funds", qs.stringify(this.formData))
              .then((res) => {
                console.log(res);
                this.$message.success("数据添加成功");
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // 修改数据
            this.$axios
              .put(
                `/api/funds/${this.formData.id}`,
                qs.stringify(this.formData)
              )
              .then((res) => {
                console.log(res);
                this.$message.success("数据编辑成功");
              })
              .catch((err) => {
                console.log(err);
              });
          }

          // 隐藏dialog
          this.dialog.show = false;
          // 添加成功后, 自动刷新页面;
          this.$emit("update");
        }
      });
    },
  },
};
</script>

<style>
</style>