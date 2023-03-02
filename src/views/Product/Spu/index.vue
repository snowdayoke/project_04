<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene==0?false:true"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- SPU列表 -->
      <div v-show="scene==0">
        <!-- 添加SPU按钮 -->
        <el-button type="primary" icon="el-icon-plus" @click="addSpu" :disabled="!category3Id">添加SPU</el-button>
        <!-- SPU列表表格 -->
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称">
          </el-table-column>
          <el-table-column prop="description" label="spu描述"> </el-table-column>
          <el-table-column  label="操作">
            <template slot-scope="{row}">
              <!-- 这里用hintbutton来替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加spu" @click="addSku"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align: center;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3,5,7]"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
        ></el-pagination>
      </div>
      <SpuForm v-show="scene==1" ref="spuForm" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene==2"></SkuForm>
    </el-card>
  </div>
</template>
  
  <script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      show: false,
      scene: 0,
      category1Id: "",
      category2Id: "",
      category3Id: "",
      records:[],  //spu数据列表
      page:1,  //当前页码
      limit:3,  //每页展示数据个数
      total:0,  //总数据个数
    };
  },

  methods: {
    // 自定义回调分别获取一级二级三级分类id
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = ''
        this.category3Id =''
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id =''
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取SPU列表数据
    async getSpuList(pages=1){
      this.page = pages
      const {page,limit,category3Id} = this
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code==200){
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 添加SPU
    addSpu(){
      this.scene = 1
      this.$refs.spuForm.addSpuList(this.category3Id)
    },
    // 修改SPU
    updateSpu(row){
      this.scene = 1
      this.$refs.spuForm.getSpu(row)
    },
    // 添加SKU
    addSku(){
      this.scene = 2
    },
    // 分页器当前页面改变时触发
    handleCurrentChange(pager){
      this.page = pager
      this.getSpuList(this.page)
    },
    // 每页展示数据条数改变时触发
    handleSizeChange(limit){
      this.limit = limit
      this.getSpuList()
    },
    // 切换场景
    changeScene({scene,flag}){
      // 通知父组件切换场景
      this.scene = scene
      // 重新获取spu列表
     if(flag=='update'){
      this.getSpuList(this.page);
     }else{
      this.getSpuList();
     }
    },
    // 
    async deleteSpu(row){
      // 删除单个spu数据
     let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code==200){
        // 弹出提示：删除成功
        this.$message({type:'success',message:'删除成功'})
        // 再次发请求,如果当前的个数<1,需要回到前一页。
        this.getSpuList(this.records.length>1?this.page:this.page-1)
        }
    }
  }
};
</script>
  
  <style>
</style>