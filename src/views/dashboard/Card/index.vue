<template>
  <div>
    <el-row :gutter="10" class="el-row">
      <el-col :span="6">
        <el-card>
            <!-- 第一个card -->
          <Detail title="销售额" count="¥ 126560">
            <template slot="charts">
                <span>周同比&nbsp;&nbsp;56.67% <svg t="1678098073750" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2740" width="16" height="16"><path d="M512 341.333333l256 256H256l256-256z" p-id="2741" fill="#d81e06"></path></svg></span>
                <span>日同比&nbsp;&nbsp;19.16% <svg t="1678098243490" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6921" id="mx_n_1678098243491" width="16" height="16"><path d="M512 682.666667l-256-256h512l-256 256z" p-id="6922" fill="#1afa29"></path></svg></span>
            </template>
            <template slot="footer">
                <span>日销售额 ¥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <!-- 第二个card -->
          <Detail title="访问量" count="88460">
            <template slot="charts">
                <LineCharts></LineCharts>
            </template>
            <template slot="footer">
                <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <!-- 第三个card -->
          <Detail title="支付笔数" count="¥ 88460">
            <template slot="charts">
                <BarCharts></BarCharts>
            </template>
            <template slot="footer">
                <span>转化率 65%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
            <!-- 第四个card -->
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
                <Progress></Progress>
            </template>
            <template slot="footer">
                <span>周同比&nbsp;&nbsp;12% <svg t="1678098073750" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2740" width="16" height="16"><path d="M512 341.333333l256 256H256l256-256z" p-id="2741" fill="#d81e06"></path></svg></span>
                <span>日同比&nbsp;&nbsp;11% <svg t="1678098243490" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6921" id="mx_n_1678098243491" width="16" height="16"><path d="M512 682.666667l-256-256h512l-256 256z" p-id="6922" fill="#1afa29"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineCharts from './LineCharts'
import BarCharts from './BarCharts'
import Progress from './Progress'
export default {
  name: "Card",
  components: { Detail,LineCharts,BarCharts,Progress },
};
</script>

<style>
</style>