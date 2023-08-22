<template>
  <div>
    <el-row>
      <el-col :span="8" style="padding-right: 10px">
        <el-card class="box-card" shadow="hover">
          <div class="user">
            <img src="../assets/images/user.jpg" alt="" />
            <div class="userinfo">
              <p class="name">{{ user.name }}</p>
              <p class="access">
                {{ user.identity == "admin" ? "超级管理员" : "普通员工" }}
              </p>
            </div>
          </div>
          <div class="login-info">
            <p>上次登录的时间: <span>2023-08-06</span></p>
            <p>上次登录的地点: <span>广东广州</span></p>
          </div>
        </el-card>
        <el-card shadow="hover" class="buyInfo">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column
              v-for="(val, key) in tableLabel"
              :key="val"
              :prop="key"
              :label="val"
            ></el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16" style="padding-left: 10px">
        <!-- 右侧第一栏：各类数字的汇总区域 -->
        <div class="num">
          <el-card
            v-for="item in countData"
            :key="item.name"
            shadow="hover"
            :body-style="{ display: 'flex', padding: 0 }"
          >
            <i
              class="icon"
              :class="`el-icon-${item.icon}`"
              :style="{ background: item.color }"
            ></i>
            <div class="detail">
              <P class="price">￥{{ item.value }}</P>
              <P class="desc">{{ item.name }}</P>
            </div>
          </el-card>
        </div>
        <!-- 右侧第二栏： 折线图-->
        <el-card shadow="hover">
          <div class="line-graph" ref="lineChart"></div>
        </el-card>
        <!-- 右侧第三栏： 两个图形-->
        <div class="bar-pie-graph">
          <!-- 第一个柱状图 -->
          <el-card shadow="hover">
            <div class="bar-graph" ref="barChart"></div>
          </el-card>
          <!-- 第二个饼图 -->
          <el-card shadow="hover">
            <div class="pie-graph" ref="pieChart"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getData } from "../api";
import echarts from "../plugins/echarts.js";

export default {
  data() {
    return {
      tableLabel: {
        name: "课程",
        todayBuy: "今日购买",
        monthBuy: "本月购买",
        totalBuy: "总购买",
      },
      tableData: [],
      countData: [
        {
          name: "今日支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "本月收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],
    };
  },
  mounted() {
    // 获取数据
    getData().then(({ data }) => {
      // 使用解构赋值的语法
      const { tableData } = data.data;
      this.tableData = tableData || [];

      // 绘制折线图
      // 基于准备好的dom,初始化echarts实例
      const lineEcharts = echarts.init(this.$refs.lineChart);
      // 指定图标的配置项和数据
      const echartsLineOptions = {};
      // 处理数据xAxis
      const { orderData, userData, videoData } = data.data;
      const xAxis = Object.keys(orderData.data[0]); // 获得key
      echartsLineOptions.xAxis = {
        data: orderData.date,
      };
      // 不设置y会报错
      echartsLineOptions.yAxis = {};
      echartsLineOptions.legend = {
        data: xAxis,
      };
      echartsLineOptions.tooltip = {};
      echartsLineOptions.series = [];
      xAxis.forEach((key) => {
        echartsLineOptions.series.push({
          name: key,
          data: orderData.data.map((item) => item[key]),
          type: "line",
        });
      });
      // 根据配置显示图表
      lineEcharts.setOption(echartsLineOptions);

      // 绘制柱状图
      const barEcharts = echarts.init(this.$refs.barChart);
      const echartsBarOptions = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: userData.map((item) => item.date),
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: [
          "#2ec7c9",
          "#b6a2de",
          "#5ab1ef",
          "#ffb980",
          "#d87a80",
          "#8d98b3",
        ],
        series: [
          {
            name: "新增用户",
            data: userData.map((item) => item.new),
            type: "bar",
          },
          {
            name: "活跃用户",
            data: userData.map((item) => item.active),
            type: "bar",
          },
        ],
      };
      barEcharts.setOption(echartsBarOptions);

      // 绘制饼图
      const pieEcharts = echarts.init(this.$refs.pieChart);
      const echartsPieOptions = {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [
          {
            data: videoData,
            type: "pie",
          },
        ],
      };
      pieEcharts.setOption(echartsPieOptions);
    });
  },
  computed: {
    user() {
      return this.$store.getters["m_admin/user"];
    },
  },
};
</script>
 
 <style lang="less" scoped>
.user {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;

  img {
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .userinfo {
    .name {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .access {
      color: #999999;
    }
  }
}

.login-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;

    span {
      color: #666666;
      margin-left: 60px;
    }
  }
}

.buyInfo {
  margin-top: 20px;
  height: 460px;
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .icon {
    width: 80px;
    height: 80px;
    font-size: 30px;
    text-align: center;
    line-height: 80px;
    color: #fff;
  }

  .detail {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 15px;

    .price {
      font-size: 30px;
      margin-bottom: 10px;
      line-height: 30px;
      height: 30px;
    }

    .desc {
      font-size: 14px;
      color: #999;
      text-align: center;
    }
  }
  .el-card {
    width: 32%;
    margin-bottom: 20px;
  }
}

.line-graph {
  height: 280px;
}

.bar-pie-graph {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;

  .el-card {
    height: 260px;
    width: 48%;
  }
  .bar-graph {
    height: 260px;
  }
  .pie-graph {
    // 原图片太大了,被遮挡住了
    // 将图片大小调小一点,这样就不会被遮挡了
    height: 240px;
  }
}
</style>