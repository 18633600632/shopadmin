<template>
  <div class="boo">
    <div class="box">
      <el-row :gutter="20">
        <el-col :span="12">
          <div  class="box1">
            <el-row class="box2">
              <el-col :span="24">商品总览</el-col>
            </el-row>
            <el-row class="box4">
              <el-col :span="6" class="col1">
                <div class="number">100</div>
                <p>已下架</p>
              </el-col>
              <el-col :span="6">
                <div class="number">400</div>
                <p>已上架</p>
              </el-col>
              <el-col :span="6">
                <div class="number">50</div>
                <p>库存紧张</p>
              </el-col>
              <el-col :span="6">
                <div class="number">500</div>
                <p>全部商品</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="12">
          <div  class="box1">
            <el-row class="box2">
              <el-col :span="24">用户总览</el-col>
            </el-row>
            <el-row class="box4">
              <el-col :span="6" class="col1">
                <div class="number">100</div>
                <p>今日新增</p>
              </el-col>
              <el-col :span="6">
                <div class="number">200</div>
                <p>昨日新增</p>
              </el-col>
              <el-col :span="6">
                <div class="number">1000</div>
                <p>本月新增</p>
              </el-col>
              <el-col :span="6">
                <div class="number">5000</div>
                <p>会员总数</p>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div id="main" style="width: 600px; height: 400px"></div>
  </div>
</template>
<script>
// 引入
import echarts from "echarts";
export default {
  // 数据可视化操作在mounted
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    // 设置容器。
    var myChart = echarts.init(document.getElementById("main"));
    // 设置配置项
    let option = {
      // 工具提示
      tooltip: {},
      legend: {
        data: ["近一周订单数量"],
      },
      //   x轴
      xAxis: {
        //   默认挨着y轴边开始
        boundaryGap: false,
        data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      },
      //   y轴
      yAxis: {},
      //   数据列表
      series: [
        {
          name: "近一周订单数量",
          type: "line",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>
<style lang="less" >
.boo {
  .box {
    width: 80%;
    margin: 0 auto;

    .box1 {
      border: 1px solid #000;
      height: 150px;
      .box2 {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        background-color: #fff;
      }
      .box4 {
        margin-top: 15px;
        text-align: center;
        .number{
          color: red;
        }
      }

      .col1 {
        padding-left: 40px;
      }
      p {
        margin-top: 10px;
      }
    }
  }
  #main {
    margin-left: 60px;
    margin-top: 40px;
  }
}
</style>