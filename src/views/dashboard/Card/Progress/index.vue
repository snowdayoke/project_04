<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from 'echarts'
export default {
    mounted() {
        let mycharts = echarts.init(this.$refs.charts)
        mycharts.setOption({
            xAxis:{
                // 隐藏x轴
                show:false,
                min:0,
                max:100
            },
            yAxis:{
                // 隐藏y轴
                show:false,
               type:'category'
            },
            series:[
                {
                    type:'bar',
                    data:[78],
                    color:'yellowgreen',
                    // 柱状图的宽度
                    barWidth:10,
                    // 背景颜色设置
                    showBackground:true,
                    backgroundStyle:{
                        color:'#eee'
                    },
                    // 文本标签
                    label:{
                        show:true,
                        // 文本内容
                        formatter:'|',
                        // 文本标签位置
                        position:'right'
                    }
                }
            ],
            grid:{
                right:0,
                left:0,
                top:0,
                bottom:0
            }

        })
    },
}
</script>

<style>
    .charts{
        width:100%;
        height:100%;
    }
</style>