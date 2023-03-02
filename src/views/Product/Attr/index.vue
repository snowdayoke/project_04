<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 表格：展示平台属性 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addValue">添加属性</el-button>
        <el-table :data="attrList" style="width: 100%;margin: 10px 0px;" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="address" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin-right: 10px;">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateValue(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性|修改属性 -->
      <div v-show="!isShowTable">
        <!-- 属性名 -->
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加属性值|取消 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <!-- 添加|修改属性值表格 -->
        <el-table :data="attrInfo.attrValueList" style="width: 100%;margin: 10px 0px;" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrInfo.attrValueList" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里要用到input和span来回切换 -->
              <el-input v-model="row.valueName" size="mini" v-if="row.flag" 
                @blur="toLook(row)" 
                @keyup.native.enter="toLook(row)" 
                placeholder="请输入属性值名称" 
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row,$index)" style="display: block;" >{{ row.valueName }}</span>
            </template>
          </el-table-column>   
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>       
        </el-table>
        <!-- 保存|取消 -->
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>  
      </div>
    </el-card>
  </div>
</template>
  
  <script>
  // 按需引入深拷贝
  import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowTable:true,   //控制table显示与隐藏
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: "",  //属性名
        attrValueList: [  //属性值
          
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3,  
      },

    };
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      // 区分三级分类响应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类有了
        this.category3Id = categoryId;
        // 发请求获取数据
        this.getAttrList();
      }
    },
    async getAttrList() {
      // 当用户确定三级分类时，可以先服务器发请求获取平台属性进行展示
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqGetAttrList(category1Id,category2Id,category3Id);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性按钮
    addValue(){
      this.isShowTable = false
      // 每次添加属性之前，将attrInfo数据清空重置。同时可以收集到category3Id
      this.attrInfo = {
        attrName: "",  //属性名
        attrValueList: [ ],  //属性值
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3,  
      }
    },
    // 添加属性值按钮
    addAttrValue(){
      // 动态添加属性值表格
      this.attrInfo.attrValueList.push({
          // 对于修改某一个属性时，可以在已有的id基础上，新增带有id属性的属性信息
          attrId: this.attrInfo.id,   //响应属性名的id
          valueName: "" ,
          flag:true  //添加flag属性值，为响应式，进而实现input与span切换
      })
      this.$nextTick(()=>{
        this.$refs[this.attrInfo.attrValueList.length-1].focus()
      })
    },
    // 编辑属性按钮
    updateValue(row){
      this.isShowTable = false
      // 这里因为对象里面包含数组，数组里面有包含对象，因此需要用到深拷贝
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach((item)=>{
        // 因为vue无法监测到普通的新增，需要用到$set方法，添加响应式数据flag
        this.$set(item,'flag', false)
      })
    },
    // 失去焦点|enter输入时
    toLook(row){
      // row当前用户添加的最新的属性值
      // 如果属性值为空，需要给用户提示，让他输入其他属性值
      if(row.valueName.trim() == ''){
        this.$message('请输入正确的属性值');
        return
      }
      // 新增的属性值不能和已有的属性值重复
      // 数组的some方法返回布尔值，将row和之前的item进行判断，如果属性值相同，则不切换成查看模式
      let isRepeat = this.attrInfo.attrValueList.some((item) =>{
        if(row!=item){
          return row.valueName == item.valueName
        }
      })
      if(isRepeat)return
      row.flag = false
    },
    // 点击span切换为input时聚焦
    toEdit(row,index){
      row.flag = true
      // 需要注意，点击span进行切换时，页面重绘和重排需要事件，不可能一点击就立马获取到input
      // $nextTick，当节点渲染完毕了，会执行一次
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    // 删除属性值
    deleteAttrValue(index){
      this.attrInfo.attrValueList.splice(index,1)
    },
    // 点击保存按钮
    async addOrUpdateAttr(){
      // 对数组数据进行过滤，去掉属性名为空，并且删掉flag属性（因为请求不需要这个参数）
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item)=>{
        if(item.valueName!=''){
          delete item.flag;
          return true
        }
      })
      try {
        // 保存请求成功的回调
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
        this.isShowTable = true
        // 提示消息
        this.$message({ type: 'success',message:'恭喜你提交成功'  })
        // 保存成功后需要再次获取数据进行展示
        this.getAttrList()  
      } catch (error) {
        this.$message('保存失败')
      }
    }
  },
};
</script>
  
  <style>
</style>