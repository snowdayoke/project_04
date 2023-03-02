<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-edit" style="margin:10px 0px" @click="addTradeMark">添加</el-button>
    <!-- 
      表格组件
      data:表格组件将来需要展示的数据----数组类型
      border：给表格添加边框
      column属性
      label：显示标题
      width：对应列的宽度
      align：标题的对齐方式
      注意：elementUI当中的table组件，展示的数据是以一列进行展示的
    -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column  prop="tmName" label="品牌名称"> 
      </el-table-column>
      <el-table-column prop="logoUrl"  label="品牌LOGO" width="width">
        <template slot-scope="{row}">
         <img :src="row.logoUrl" style="width: 100px;height: 100px;">
        </template>
      </el-table-column>
      <el-table-column prop="address"  label="操作">
        <template slot-scope="{row}">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器 --当前第几页、数据总条数、每一页展示条数、连续页码数 
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" 

      current-page：代表的是当前第几页
      total：代表分页器一共展示数据条数
      page-size：代表每一页可以展示多少条数据
      page-sizes：代表可以设置每一页展示多少条数据
      layout：可以实现分页器布局
      pager-count: 页码按钮的数量
    -->
    <el-pagination style="margin-top: 20px;textAlign: center;"
    :current-page="page" 
    :total="totalNum" 
    :page-size="limit" 
    :page-sizes="[3, 7, 10]"
    :pager-count="7"
    layout="prev, pager, next, jumper, ->, sizes, total"
    @current-change="handleCurrentChange" 
    @size-change="handleSizeChange">
    </el-pagination>
    <!-- 
      对话框
      :visible.sync：控制对话框显示与隐藏用的
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
     -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单：model属性--把表单的数据收集到哪个对象身上，将来表单验证也需要这个属性 -->
      <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="tmForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- upload上传图片
          action：设置图片上传的地址
          on-success：可以检测到图片上传成功，图片上传成功之后，会执行一次
          before-upload：在上传图片之前，会执行一次
         -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { thisTypeAnnotation } from '@babel/types';



export default {
    name:'TradeMark',
    data() {
      // 自定义验证规则
      var validateName = (rule, value, callback) => {
        if (value.length < 2 || value.length > 10) {
          callback(new Error('长度在 2 到 10 个字符'));
        } else {
          callback();
        }
      }
      return {
        // 分页器第几页
        page:1,
        // 每页展示数据的条数
        limit:3,
        // 总的数据条数
        totalNum:99,
        // 列表展示的数据
        tableData:[],
        // 对话框是否显示
        dialogFormVisible: false,
        // 收集品牌信息：对象身上的属性，不能瞎写，需要看文档
        tmForm:{
          tmName: '',
          logoUrl: ''
        },
        // 表单验证规则
        rules:{
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
            { validator:validateName, trigger:'change'}
          ],
          logoUrl: [
            { required: true, message: '请选择要上传的品牌图片', trigger: 'change' }
          ],
        }
      }   
    },
    mounted() {
      // 组件挂载完毕发请求
      this.getPageList()
    },
    methods:{
      // 获取品牌列表的数据
      async getPageList(){
        const {page,limit} = this   //解构出参数
        let result = await this.$API.tradeMark.reqTradeMarkList(page,limit)  
        if(result.code==200){    
          this.totalNum = result.data.total
          this.tableData = result.data.records
          return 'ok'
        }else{
          return Promise.reject(new Error('failed'))
        } 
      },
      // 当前页码改变
      handleCurrentChange(pager){
        this.page = pager
        this.getPageList()
      },
      // 每页展示数据发生变化
      handleSizeChange(size){
        this.limit = size
        this.getPageList()
      },
      // 点击添加品牌
      addTradeMark(){
        // 是否显示对话框
        this.dialogFormVisible = true
        // 点击之前清空数据
        this.tmForm = {tmName:'',logoUrl:''}
      },
      // 点击修改品牌
      updateTradeMark(row){
        this.dialogFormVisible = true
        // 将已有品牌信息赋值给tmForm展示在对话框里，即将服务器返回的品牌信息赋值给了tmForm
        // 浅拷贝：只是将服务器返回的信息row拷贝一份给tmForm，tmForm再进行修改不会影响服务器的数据row
        this.tmForm = {...row}
      },
      // 上传图片成功
      handleAvatarSuccess(res, file) {
        // res上传成功之后返回给前端的地址  file上传成功之后返回前端数据
        // 收集品牌图片地址数据，因为将来需要带给服务器
        this.tmForm.logoUrl = res.data;
      },
      // 图片上传之前
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 对话框确定按钮（添加品牌|修改品牌）
      addOrUpdateTradeMark(){
        this.$refs.tmForm.validate(async (success) => {
          if(success){
            this.dialogFormVisible = false
            let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
            if(result.code==200){
              // 弹出信息：修改品牌成功|添加品牌成功
              this.$message({
                type: 'success',
                message:this.tmForm.id?'修改品牌成功':'添加品牌成功'
              }),
              // 添加成功之后，需要再次获取数据进行展示
              // 添加品牌：停留在第一页，修改品牌应该留在当前页
              this.getPageList(this.tmForm.id?this.page:1)
            }
          }else{
            console.log('error submit!!');
            return false;
          }
        })      
    },
    // 删除品牌操作
    deleteTradeMark(row){
      // 弹框
      this.$confirm(`你确定删除${row.id}`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 当用户点击确定按钮时触发
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
          if(result.code == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getPageList(this.tableData.length > 1 ? this.page:this.page-1)
          }  
        }).catch(() => {
          // 当用户点击取消按钮时触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
    },
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>