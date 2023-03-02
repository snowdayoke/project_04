// 主要获取 品牌管理 的数据的接口
import request from '@/utils/request'

// 1.获取品牌列表接口   /admin/product/baseTrademark/{page}/{limit}  method:get
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 2.新增或修改品牌列表  
// 新增品牌  /admin/product/baseTrademark/save    method:post  携带2个参数：品牌名称、品牌LOGO
// 切记：对于新增的品牌，给服务器传递数据，不需要传递id，id是由服务器生成

// 修改品牌 /admin/product/baseTrademark/update  method:put   携带3个参数：id、品牌名称、品牌LOGO
// 切记：对于修改某一个品牌的操作，携带的参数需要带上id，需要告诉服务器修改的是哪一个品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put', data:tradeMark})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

// 3.删除品牌列表  /admin/product/baseTrademark/remove/{id}  method:delete
export const reqDeleteTradeMark = (id) => request({
    url:`/admin/product/baseTrademark/remove/${id}`, method:'delete'
})
