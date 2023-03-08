// 主要获取 SKU模块 的数据的接口
import request from '@/utils/request'

// 1.获取SKU的全部列表 /admin/product/list/{page}/{limit}  请求方式：get
export const reqSkuList = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// 2.下架sku  /admin/product/cancelSale/{skuId}  请求方式：get
export const reqCancelSale = (skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 3.上架sku  /admin/product/onSale/{skuId}   请求方式：get
export const reqOnSale = (skuId) => request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// 4.获取sku详情  /admin/product/getSkuById/{skuId}  请求方式：get
export const reqGetSkuById = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})