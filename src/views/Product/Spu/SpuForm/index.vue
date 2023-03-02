<template>
  <div>
    {{ unSelectAttr }}
    <el-form label-width="80px" :model="spu">
      <!-- SPU名称 -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <!-- 品牌 -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- SPU描述 -->
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <!-- SPU图片 -->
      <el-form-item label="SPU图片">
        <!-- file-list:上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}] .数组
            on-preview:点击文件列表中已上传的文件时的钩子
            on-remove:文件列表移除文件时的钩子
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"  
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="imageList"  
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 利用到了unSelect属性 -->
        <el-select :placeholder="`还有${unSelectAttr.length}未选择`" value="" v-model="attrIdAndAttrValue">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`" v-for="unSelect in unSelectAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrValue" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="200">
          </el-table-column>
          <el-table-column label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <el-tag :key="attrValue.id" v-for="(attrValue,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="handleClose(row,index)">
                {{attrValue.saleAttrValueName}}
              </el-tag>
              <!-- input输入框 @keyup.enter.native="handleInputConfirm"
                 -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small"
              @blur="handleInputConfirm(row)"> 
              </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="操作" width="180">
            <template slot-scope="{$index}">
              <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttr($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存||取消 -->
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      tradeMarkList:[], //全部品牌信息
      imageList:[], //存储spu的图片信息
      saleAttrList:[],//全部销售属性   
      spu: {  //收集到的响应式数据，将最新的数据提交给服务器
          category3Id:'',
          spuName:'',
          description:'',
          tmId:'',
          // 收集spu图片的信息
          spuImageList:[
          {
            // imgName: "string",
            // imgUrl: "string",
            // spuId: 0
          }],
          // 平台属性与属性值收集
          spuSaleAttrList: [
            // {
            //   baseSaleAttrId: 0,
            //   saleAttrName: '',
            //   spuId: 0,
            //   spuSaleAttrValueList: [{
            //       baseSaleAttrId: 0,
            //       isChecked: '',
            //       saleAttrName: '',
            //       saleAttrValueName: '',
            //       spuId: 0
            //     }] 
            // }
          ]             
      },
      attrIdAndAttrValue:'',//收集未选择的销售属性id
    }
  },
  computed:{
    unSelectAttr(){
      // 整个平台一共有3个属性：尺寸、颜色、版本   -----saleAttrList
      // 当前spu所拥有的的属性：颜色、版本        ----spu.spuSaleAttrList  
      let result = this.saleAttrList.filter(item=>{
        return this.spu.spuSaleAttrList.every(item1=>{
          return item.name != item1.saleAttrName
        })
      })
      return result;
    }
  },
  methods: {
    // 照片墙删除图片时的回调
    handleRemove(file, fileList) {
      this.imageList =  fileList
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList){
      this.imageList = fileList
    },
    // 预览图片时的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 点击修改spu的回调
    async getSpu(row){
      // 获取单个spu信息
      let spuResult = await this.$API.spu.reqSpuById(row.id)
      if(spuResult.code==200){
        this.spu = spuResult.data
      }
      // 获取全部品牌信息
      let tmResult = await this.$API.spu.reqTradeMark()
      if(tmResult.code==200){
        this.tradeMarkList = tmResult.data
      }
      // 获取单个spu图片信息
      let imageResult = await this.$API.spu.reqImageList(row.id)
      if(imageResult.code==200){
        // 由于照片墙展示图片的数据需要数组，数组里面的元素需要有name和url字段
        // 需要把服务器返回的数据进行修改
        let ListArr = imageResult.data
        ListArr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        // 把整理好的数据赋值给imageList
        this.imageList = ListArr
      }
      // 获取全部属性信息
      let saleAttrResult = await this.$API.spu.reqSaleAttr()
      if(saleAttrResult.code==200){
        this.saleAttrList = saleAttrResult.data
      }
    },
    // 点击添加SPU的回调
    async addSpuList(category3Id){
      // 获取全部品牌信息
       let tmResult = await this.$API.spu.reqTradeMark()
      if(tmResult.code==200){
        this.tradeMarkList = tmResult.data
      }
      // 获取全部属性信息
      let saleAttrResult = await this.$API.spu.reqSaleAttr()
      if(saleAttrResult.code==200){
        this.saleAttrList = saleAttrResult.data
      }
      this.spu.category3Id = category3Id
    },
    // 添加销售属性按钮
    addSaleAttr(){
      // 把select收集到的销售属性进行分割
      const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrValue.split(':')
      // 向spu对象的spuSaleAttrList添加新的销售属性
      let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // select框清空
      this.attrIdAndAttrValue = ''
    },
    // tag标签点击x删除
    handleClose(row,index){
        row.spuSaleAttrValueList.splice(index,1)                                            
    },
    // button按钮添加属性值回调，切换为input
    addAttrValue(row){
      this.$set(row,'inputVisible','false')
      this.$set(row,'inputValue','')
      row.inputVisible = true
    },
    // input失去焦点
    handleInputConfirm(row){
      const {baseSaleAttrId,inputValue} = row
      // 判断：输入值不能为空
      if(inputValue.trim() == ''){
        this.$message('属性值不能为空')
        row.inputVisible = false
        return
      }
      // 判断：属性值不能重复
      let isRepeated = row.spuSaleAttrValueList.every(item => 
        item.saleAttrValueName != inputValue.trim()
      )
      if(!isRepeated){
        this.$message('属性值不能重复')
        row.inputVisible = false
        return
      }
      // 切换为button按钮
      row.inputVisible = false
      // 收集到的输入值转成一个对象，添加到row.spuSaleAttrValueList
      let newAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
      row.spuSaleAttrValueList.push(newAttrValue)
    },
    // 点击删除按钮，删除属性
    deleteAttr(index){
      this.spu.spuSaleAttrList.splice(index,1)
    },
    // 保存按钮--添加||修改spu
    async addOrUpdateSpu(){
      // 1.整理发请求的参数:照片墙的2个字段imgName imgUrl
      this.spu.spuImageList = this.imageList.map((item)=>{
       return {
        imgName: item.name,
        imgUrl: item.response?item.response.data:item.url
       }
      })
      // 2.发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if(result.code==200){
        // 提示保存成功
        this.$message({type:'success',message:'保存成功'})
        // 通知父组件场景切换
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'update':'add'})
      }
      // 3.清空数据
      Object.assign(this._data,this.$options.data())
    },
    // 取消按钮
     cancel(){
      // 切换场景
      this.$emit('changeScene',{scene:0,falg:''})
      // 清空数据
      // Object.assign:es6中新增的方法，可以合并对象
      // 组件实例this._data,可以操作data中的响应式数据
      // this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data,this.$options.data())
     }
  },
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
