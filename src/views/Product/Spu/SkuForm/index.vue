<template>
  <div>
    <el-form label-width="80px" :model="skuInfo">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input type="number" placeholder="价格(元)" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item :label=attr.attrName style="margin-left: 20px" v-for="attr in attrInfoList" :key=attr.id>
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label=attrValue.valueName :value="`${attrValue.attrId}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item :label="saleAttr.saleAttrName" style="margin-left: 20px" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndSaleAttrValueId">
              <el-option :label=saleAttrValue.saleAttrValueName :value="`${saleAttrValue.baseSaleAttrId}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table  style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80">
          </el-table-column>
          <el-table-column prop="name" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width: 80px;height: 80px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" v-if="row.isDefault==0" @click="changeDefault(row)">设为默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  
<script>
export default {
  name: "SkuForm",
  data(){
    return {
      spu:{},
      attrInfoList:[],  //平台属性列表
      spuSaleAttrList:[],  //该spu的销售属性
      spuImageList:[],  //存放的是该spu的全部图片信息
      imageList:[],  //收集选择的图片的数据：但是要注意，目前缺少isDefault字段，将来提交给服务器时，需要整理参数
      skuInfo:{
        category3Id: '',
        skuName: '',
        price: '',
        skuDefaultImg: '',
        skuDesc:'',
        spuId: '',
        tmId: '',
        weight: '',
        skuAttrValueList: [
          {
            attrId: '',
            valueId: '',
          }
        ],
        skuImageList: [
          {
            imgName: '',
            imgUrl: '',
            isDefault: '',
          }
        ],
        skuSaleAttrValueList: [
            {
              saleAttrId: '',       
              saleAttrValueId: '',
            }
        ]
      }  
    }
  },
  methods: {
    // 获取平台属性、销售属性、图片
    async addSkuList(category1Id,category2Id,spu){
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      // 获取平台属性
      let result = await this.$API.spu.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
      if(result.code==200){
        this.attrInfoList = result.data
      }
      // 获取销售属性
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if(result1.code==200){
        this.spuSaleAttrList = result1.data
      }
      // 获取图片
      let result2 = await this.$API.spu.reqSpuImageList(spu.id)
      if(result2.code==200){
        let list = result2.data
        // 给服务器传回的数据添加isDefault属性
        list.forEach(item=>{
          item.isDefault = 0
        })
        this.spuImageList = list
      }
    },
    // 修改默认图片
    changeDefault(row){
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      row.isDefault = 1
      // 将设为默认的图片信息收集到skuInfo.skuDefaultImg
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 复选框勾选变化回调
    handleSelectionChange(val){
      // 获取到用户选中的图片信息
      this.imageList = val
    },
    //取消按钮 
    cancel(){
      // 切换场景
      this.$emit('changeScenes',0)
      // 清空数据
      Object.assign(this._data,this.$options.data())
    },
    //保存按钮
    async save(){
      // 整理参数
      const {attrInfoList,skuInfo,spuSaleAttrList} = this
      // 整理平台属性参数
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
       if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        return prev
      },[])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.saleAttrIdAndSaleAttrValueId){
          const [saleAttrId,saleAttrValueId] = item.saleAttrIdAndSaleAttrValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 整理图片
      skuInfo.skuImageList = this.imageList
      // 发请求
      let result = await this.$API.spu.reqAddSkuInfo(skuInfo)
      if(result.code==200){
        // 弹出消息提示：添加SKU成功
        this.$message({type:'success',message:'添加SKU成功'})
        // 场景切换
        this.$emit('changeScenes',0)
        // 清空数据
        Object.assign(this._data,this.$options.data())
      }
   },
 }
}
</script>
  
  <style>
</style>