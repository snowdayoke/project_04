<template>
  <div>
    <div class="header">
        <span>{{ title }}</span>
        <svg t="1678164047316" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2761" width="18" height="18"><path d="M512 958.016C266.08 958.016 65.984 757.952 65.984 512 65.984 266.08 266.08 65.984 512 65.984c245.952 0 446.016 200.064 446.016 446.016 0 245.952-200.064 446.016-446.016 446.016z m0-828.032c-210.656 0-382.016 171.36-382.016 382.016 0 210.624 171.36 382.016 382.016 382.016 210.624 0 382.016-171.36 382.016-382.016S722.624 129.984 512 129.984z" p-id="2762" fill="#707070"></path><path d="M464 304a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0zM512 768c-17.664 0-32-14.304-32-32V448c0-17.664 14.336-32 32-32s32 14.336 32 32v288c0 17.696-14.336 32-32 32z" p-id="2763" fill="#707070"></path></svg>
    </div>
    <div class="data">
        <span>12321</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span class="data-right">17.1
          <svg t="1678175111304" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2754" width="14" height="14"><path d="M541.0304 928.9216H482.9696a28.9792 28.9792 0 0 1-29.0304-28.9792V195.8912h116.1216v704.0512a28.9792 28.9792 0 0 1-29.0304 28.9792z" fill="#d81e06" p-id="2755"></path><path d="M724.48 499.1488L512 286.72 299.52 499.1488a29.0816 29.0816 0 0 1-40.96 0l-40.96-40.96a29.0816 29.0816 0 0 1 0-40.96L512 122.4192l294.6048 294.6048a29.0816 29.0816 0 0 1 0 40.96l-40.96 40.96a29.0816 29.0816 0 0 1-41.1648 0.2048z" fill="#d81e06" p-id="2756"></path></svg>
          <svg t="1678175548378" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3892" width="16" height="16"><path d="M512 858.7264a32 32 0 0 1-32-32V124.7744a32 32 0 1 1 64 0v701.952a32 32 0 0 1-32 32z" fill="#1afa29" p-id="3893"></path><path d="M512 901.7344L234.9056 624.64a32 32 0 1 1 45.2608-45.2608L512 811.2128l231.8336-231.7824a32 32 0 0 1 45.2608 45.2608z" fill="#1afa29" p-id="3894"></path></svg>
        </span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
    props:['title'],
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
                    color:'blue'
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
                            offset: 0, color: 'blue' // 0% 处的颜色
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
    .header{
      color:gray
    }
    .header svg{
       margin: 0px 15px;
       vertical-align: middle;
    }
    .data{
      font-size: 18px;
    }
    .data .data-right{
      font-size: 14px; 
    }
    .data span{
      margin-right: 15px;
    }
    .data svg{
      vertical-align: middle;
    }
    .charts{
      width:100%;
      height:60px
    }
</style>