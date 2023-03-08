// 主要获取 SPU模块 的数据的接口
import request from '@/utils/request'

// 1.获取SPU列表信息  /admin/product/{page}/{limit}  query参数：category3Id  请求方式：get
export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }  //这里是kv一致省略v 原本应是{category3Id：category3Id}
})

// 2.获取某个spu基本信息   /admin/product/getSpuById/{spuId}   请求方式：get
export const reqSpuById = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 3.获取全部品牌信息     /admin/product/baseTrademark/getTrademarkList  请求方式：get
export const reqTradeMark = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 4.获取某个spu图片信息  /admin/product/spuImageList/{spuId}   请求方式：get
export const reqImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 5.获取平台全部销售属性   /admin/product/baseSaleAttrList   请求方式：get
export const reqSaleAttr = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' })

// 6.保存SPU信息  /admin/product/saveSpuInfo  请求方式：post
export const reqAddOrUpdateSpu = (spuInfo) => {
    if (spuInfo.id) {
        // 修改spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    } else {
        // 添加spu
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
    }
}

// 7.删除SPU /admin/product/deleteSpu/{spuId}  请求方式：delete
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})

// 8.获取平台属性  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  请求方式：get
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})
// 9.获取销售属性  /admin/product/spuSaleAttrList/{spuId}   请求方式：get
export const reqSpuSaleAttrList = (spuId) => request({ url: `/admin/product/spuSaleAttrList/${spuId}`, method: 'get' })
// 10.获取图片信息 /admin/product/spuImageList/{spuId}  请求方式：get
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 11.添加SKU保存信息  /admin/product/saveSkuInfo  请求方式：post
export const reqAddSkuInfo = (skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 12.获取单个SPU的sku列表  /admin/product/findBySpuId/{spuId}  请求方式：get
export const reqSkuById = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})