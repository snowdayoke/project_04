<template>
   <el-card class="box-card" >
        <div slot="header" class="clearfix">
          <div class="category-header">
            <span>销售额类别占比</span>
           <el-radio-group v-model="value" size="medium">
            <el-radio-button label="全部渠道"></el-radio-button>
            <el-radio-button label="线上"></el-radio-button>
            <el-radio-button label="门店"></el-radio-button>
          </el-radio-group>
          </div>
       </div>
       <div>
         <div class="charts" ref="charts"></div>
       </div>
    </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
   data(){
      return{
         value:'全部渠道'
      }
   },
   mounted() {
      let mycharts = echarts.init(this.$refs.charts)
      mycharts.setOption({
         title:{
            text:'视频',
            subtext:1048,
            left:'center',
            top:'center'
         },
         tooltip: {
            trigger: 'item'
         },
         series: [
            {
               name: 'Access From',
               type: 'pie',
               radius: ['40%', '70%'],
               avoidLabelOverlap: false,
               itemStyle: {
               borderRadius: 10,
               borderColor: '#fff',
               borderWidth: 2
               },
               label: {
               show: true,
               position: 'outside'
               },
               labelLine: {
               show: true
               },
               data: [
               { value: 1048, name: 'Search Engine' },
               { value: 735, name: 'Direct' },
               { value: 580, name: 'Email' },
               { value: 484, name: 'Union Ads' },
               { value: 300, name: 'Video Ads' }
               ]
            }
         ]
         })  
         mycharts.on('mouseover', (params) => {
            //  获取鼠标移上去的部分饼状图的数据
            const {value,name} = params.data
            // 重新设置标题
            mycharts.setOption({
               title:{
                  text:name,
                  subtext:value
               }
            })
         }); 
   },
}
</script>

<style scoped>
   .category-header{
      display:flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
   }
   .charts{
      width: 100%;
      height: 210px;
   }
</style>