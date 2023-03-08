<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
   name:'LineCharts',
   mounted(){
    let mycharts = echarts.init(this.$refs.charts)
    mycharts.setOption({
        xAxis:{
            show:false,
            type:'category'
        },
        yAxis:{
            show:false
        },
         // 布局调试
         grid:{
                    left:0,
                    right:0,
                    top:0,
                    bottom:0
                },
        series:[
            {
                smooth:true,
                type:'line',
                data:[12,69,36,49,26,44,88,50],
                // 拐点隐藏
                itemStyle:{
                    opacity:0
                },
                // 线条颜色
                lineStyle:{
                    color:'purple'
                },
                // 区域填充颜色
                areaStyle:{
                    color:{
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'purple' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#fff' // 100% 处的颜色
                        }],
                        global: false // 缺省为 false
                    }
                }
            }
        ],
     
    })
   }
}
</script>

<style>
    .charts{
        width:100%;
        height:100%
    }
</style>