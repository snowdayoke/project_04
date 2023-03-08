<template>
  <div>
    <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Time1.add')!=-1">添加</el-button>
    <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Time1.delete')!=-1">删除</el-button>
  </div>
</template>

<script>
export default {
  name:'Time1'
}
</script>

<style>

</style>