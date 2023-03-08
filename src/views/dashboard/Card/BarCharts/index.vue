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
                type:'category'
            },
            yAxis:{
                // 隐藏y轴
                show:false
            },
            series:[
                {
                    type:'bar',
                    data:[10,65,29,44,31,88,60],
                    color:'cyan'
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

</style>