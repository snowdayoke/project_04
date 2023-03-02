<template>
  <div>
    <!-- inline:代表的是行内表单，代表一行可以放置多个表单元素 -->
    <el-form :inline="true"  class="demo-form-inline" :model="cForm">
        <!-- v-model收集的是option里的value的值 -->
      <el-form-item label="一级分类">
        <!-- change 选中值发生变化时触发,属于自定义事件 -->
        <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value='c1.id' v-for="(c1) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value='c2.id' v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value='c3.id' v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:['show'],
  data() {
    return {
        // 一级分类的数据
       list1:[],
       list2:[],
       list3:[],
       // 收集相应一级二级三级分类的id   
       cForm:{
        category1Id:'',
        category2Id:'',
        category3Id:''
       }
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods:{
        async getCategory1List(){
            let result = await this.$API.attr.reqCategory1List()
            if(result.code==200){
                this.list1 = result.data
            }
        },
        //一级分类改变的自定义回调
        async handler1(){
            // 清除数据
            this.list2 = []
            this.list3 = []
            this.cForm.category2Id = ''
            this.cForm.category3Id = ''
            const {category1Id} = this.cForm
            this.$emit('getCategoryId',{categoryId:category1Id,level:1})
            // 通过一级分类的id，获取二级分类的数据
            let result = await this.$API.attr.reqCategory2List(category1Id)
            if(result.code==200){
                this.list2 = result.data
            }
        },
        // 二级分类改变的自定义回调
        async handler2(){
            // 清除数据
            this.list3 = []
            this.cForm.category3Id = ''
            const {category2Id} = this.cForm
            this.$emit('getCategoryId',{categoryId:category2Id,level:2})
             // 通过二级分类的id，获取三级分类的数据
            let result = await this.$API.attr.reqCategory3List(category2Id)
            this.list3 = result.data
        },
        // 三级分类改变的自定义回调
        handler3(){
            const {category3Id} = this.cForm
            this.$emit('getCategoryId',{categoryId:category3Id,level:3})
        }
    }
}
</script>

<style>
</style>