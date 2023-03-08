<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
            <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts title="搜索用户数"> </LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts title="人均搜索次数"></LineCharts>
        </el-col>
      </el-row>
    </div>
    <!-- table表格 -->
      <el-table border class="table"  :data="tableData"
        style="width: 100%"
      >
        <el-table-column label="排名"  width="80">
        </el-table-column>
        <el-table-column label="搜索关键字" width="150">
        </el-table-column>
        <el-table-column  label="用户数" sortable>
        </el-table-column>
        <el-table-column  label="周涨幅" sortable>
        </el-table-column>
      </el-table>
      <!-- 分页器 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"-->
      <el-pagination class="pagination"
        :current-page="1"
        :page-size="5"
        layout="prev, pager, next"
        :total="100">
     </el-pagination>
  </el-card>
</template>

<script>
import LineCharts from "./LineCharts";
export default {
  components: { LineCharts },
  data(){
    return{
        tableData:[{}]
    }
  }
};
</script>

<style>
    .search-header{
       display:flex;
       justify-content: space-between; 
    }
    .table{
        margin:10px 0px
    }
    .pagination{
        float: right;
    }
</style>