import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /**
   * spu
   *
   * GET /admin/product/cancelSale/{skuId}
   * DELETE /admin/product/deleteSku/{skuId}    删除SKU
   * GET /admin/product/spuImageList/{spuId}   获取指定spu图片信息
   * GET /admin/product/findBySpuId/{spuId}    获取sku信息
   * GET /admin/product/list/{page}/{limit}    根据页码获取数据
   * GET /admin/product/cancelSale/{skuId}     取消上架
   * GET /admin/product/onSale/{skuId}          上架商品
   * GET /admin/product/getSkuById/{skuId}      获取单个sku商品
   */
  getSkuById(skuId) {
    return request.get(`${api_name}/getSkuById/${skuId}`)
  },

  changeStatus(sku) {
    return request.get(`${api_name}/${sku.isSale ? 'cancelSale' : 'onSale'}/${sku.id}`)
  },

  getPage(page, limit) {
    return request.get(`${api_name}/list/${page}/${limit}`)
  },

  cancel(skuId) {
    return request.get(`${api_name}/cancelSale/${skuId}`)
  },
  delete(skuId) {
    return request.delete(`${api_name}/deleteSku/${skuId}`)
  },
  getImage(spuId) {
    return request.get(`${api_name}/spuImageList/${spuId}`)
  },
  getList(spuId) {
    return request.get(`${api_name}/findBySpuId/${spuId}`)
  },
  /**
  * 保存SKU
  * POST /admin/product/saveSkuInfo
  * POST /admin/product/updateSkuInfo
  */
  addUpdate (skuInfo) {
    return request.post(`/admin/product/${skuInfo.id ? 'update' : 'save'}SkuInfo`, skuInfo)
  },
}
