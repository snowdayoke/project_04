<template>
    <div>
      <el-button type="primary" v-show="$store.state.user.buttons.indexOf('btn.Time2.edit')!=-1">修改</el-button>
    </div>
  </template>
  
  <script>
  export default {
    name:'Time2'
  }
  </script>
  
  <style>
  
  </style>