<template>
  <div>
    <!-- sku列表表格 -->
    <el-table :data="records" style="width: 100%" border >
      <el-table-column type="index" label="序号" width="80"  style="text-align: center;"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"> </el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片" width="150">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px" />
        </template>
        </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="width"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="120"> </el-table-column>
      <el-table-column prop="address" label="操作" width="300"> 
        <template slot-scope="{row}">
          <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==1" @click="cancelSale(row)"></el-button>
          <el-button type="info" icon="el-icon-top" size="mini" v-else @click="onSale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination style="text-align: center;"
      :current-page=page
      :page-sizes="[3,7,10]"
      :page-size=limit
      layout="prev, pager, next, ->, sizes, total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange">
    </el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="drawer" :direction="direction" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="300px" style="width:300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>
  
  <script>
export default {
  name: "Sku",
  data() {
    return {
      page:1,
      limit:3,
      total:0,
      records:[],
      drawer: false,  //抽屉默认隐藏
      direction: 'rtl', //抽屉方向从右向左
      skuInfo:{}  //sku详情信息
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取SKU列表数据
    async getSkuList(pager = 1){
      this.page = pager
      const {page,limit} = this
      let result = await this.$API.sku.reqSkuList(page,limit)
      if(result.code==200){
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    //分页器页面展示数据改变时触发
    handleSizeChange(limit){
      this.limit = limit
      this.getSkuList()
    },
    // 点击下架sku
    async cancelSale(row){
      let result = await this.$API.sku.reqCancelSale(row.id)
      if(result.code==200){
        row.isSale = 0
        this.$message({type:'success',message:'下架成功'})
      }
    },
    //点击上架sku 
    async onSale(row){
      let result = await this.$API.sku.reqOnSale(row.id)
      if(result.code==200){
        row.isSale = 1
        this.$message('下架成功')
      }
    },
    //点击编辑按钮 
    edit(){
      this.$message('正在开发中')
    },
    // 
    async getSkuInfo(row){
      let result = await this.$API.sku.reqGetSkuById(row.id)
      if(result.code==200){
        this.skuInfo = result.data
        this.drawer = true    //显示抽屉
      }
    }

  },
};
</script>

<style>
  .el-carousel__item img{
      width: 100%;
      height: 100%;

  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

 
</style>
  
<style scoped>
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin: 10px 10px;
  }

  /* 深度选择器>>> */
  >>>.el-carousel__button {
    width: 10px;
    height: 10px;
    background: purple;
    border-radius: 50%;
  }
</style>

