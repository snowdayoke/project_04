// 主要获取 平台属性模块 的数据的接口
import request from '@/utils/request'

// 1.获取一级分类   /admin/product/getCategory1    请求方式:get
export const reqCategory1List = (id) => request({url:`/admin/product/getCategory1`,method:'get'})

// 2.获取二级分类   /admin/product/getCategory2/{category1Id}    请求方式:get
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`, method:'get'})

// 3.获取三级分类   /admin/product/getCategory3/{category2Id}    请求方式:get
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`, method:'get'})

// 4.获取商品属性列表 /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  请求方式:get
export const reqGetAttrList = (category1Id,category2Id,category3Id) => request({
    url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method:'get'
})

// 5.添加属性名与属性值   /admin/product/saveAttrInfo   请求方式:post
export const reqAddOrUpdateAttr = (data) => request({
    url:'/admin/product/saveAttrInfo',
    method:'post',
    data
})