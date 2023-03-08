<template>
  <el-card class="box-card" style="margin:10px 0px">
    <div class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
            <!--   @tab-click="handleClick" -->
            <el-tab-pane label="销售额" name="sale"></el-tab-pane>
            <el-tab-pane label="访问量" name="visit"></el-tab-pane>
        </el-tabs>
          <!-- 头部右侧内容 -->
        <div class="right">
            <span @click="setDay">今日</span>
            <span @click="setWeek">本周</span>
            <span @click="setMonth">本月</span>
            <span @click="setYear">本年</span>
            <!-- 日历 -->
                <el-date-picker size="mini" class="date"
                v-model="date"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd">
               </el-date-picker>
        </div>   
    </div>
    <div>
        <el-row>
            <el-col :span="18">
                <div class="charts" ref="charts"></div>
            </el-col>
            <el-col :span="6">
                <h3>门店{{ title }}排名</h3>
                <ul>
                    <li>
                        <span class="index">1</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        <span class="index">2</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        <span class="index">3</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        
                        <span>4</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        <span>5</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        <span>6</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                    <li>
                        <span>7</span>
                        <span>肯德基</span>
                        <span class="rvalue">123456</span>
                    </li>
                </ul>
            </el-col>
        </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    data(){
        return{
            activeName:'sale',
            mycharts:null,
            // 收集日历的数据
            date:[]
        }
    },
    computed:{
        title(){
            return this.activeName == 'sale'?'销售额':'访问量'
        },
        // vuex中的使用mock获取的list数据
        ...mapState({
            listSate:state=>state.home.list
        })
    },
    watch:{
        title(){
            // 重新修改图表的配置数据
            // 图表配置数据可以再次修改，如果有新的数值，用新的数值；没有新的数值，还是用以前的
            this.mycharts.setOption({
                title:{
                    text:`${this.title}趋势`
                },
                xAxis:{
                    data:this.title=='销售额'?this.listSate.orderFullYearAxis:this.listSate.userFullYearAxis
                },
                series:[
                  {
                    data:this.title=='销售额'?this.listSate.orderFullYear:this.listSate.userFullYear
                  }
                ]
            })
        },
        // 监听listSate，当有了数据，立马使用展示在页面
        listSate(){
            this.mycharts = echarts.init(this.$refs.charts)
        this.mycharts.setOption({
            title:{
                text:`${this.title}趋势`
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: this.listSate.orderFullYearAxis,
                axisTick: {
                    alignWithLabel: true
                }
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ],
            series: [
                {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: this.listSate.orderFullYear,
                color:'skyblue'
                }
            ]
        })
        }
    },
    mounted() {
        this.mycharts = echarts.init(this.$refs.charts)
        this.mycharts.setOption({
            title:{
                text:`${this.title}趋势`
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                type: 'category',
                data: [],
                axisTick: {
                    alignWithLabel: true
                }
                }
            ],
            yAxis: [
                {
                type: 'value'
                }
            ],
            series: [
                {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: [],
                color:'skyblue'
                }
            ]
        })
    },
    methods:{
        // 今日
        setDay(){
            const day = dayjs().format('YYYY-MM-DD')
            this.date = [day,day]
        },
        setWeek(){
            const start = dayjs().day(1).format('YYYY-MM-DD')
            const end = dayjs().day(7).format('YYYY-MM-DD')
            this.date = [start,end]
        },
        setMonth(){
            const start = dayjs().startOf('month').format('YYYY-MM-DD')
            const end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.date = [start,end]
        },
        setYear(){
            const start = dayjs().startOf('year').format('YYYY-MM-DD')
            const end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.date = [start,end]
        }
    }
}
</script>

<style scoped>
    .clearfix{
        position: relative;
        display: flex;
        justify-content: space-between;
    }
    .tab{
        width:100%
    }
    .right{
        position:absolute;
        right:0px
    }
    .date{
        width:250px
    }
    .right span {
      margin-right: 15px;
    }
    .charts{
        width:100%;
        height:400px
    }
    ul{
        list-style: none;
        width:100%;
        height:320px;
        padding: 0px;
    }
    ul li{
       height:15%;
    }
    ul span {
        margin-right: 25px;
    }
    .index{
        float: left;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: black;
        color: white;
        text-align: center;
    }
    .rvalue{
        float:right
    }
</style>