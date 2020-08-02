import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /**
   * spu
   *
   * GET /admin/product/baseSaleAttrList    获取所有销售属性列表
   * DELETE /admin/product/deleteSpu/{spuId}    删除SPU
   * GET /admin/product/getSpuById/{spuId}    获取指定spu信息
   * POST /admin/product/saveSpuInfo          增加spu信息
   * POST /admin/product/updateSpuInfo        更改spu信息
   * GET /admin/product/{page}/{limit}        获取分页spu信息
   */

  getAllInfo() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: 'get'
    })
  },
  delete(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: 'delete'
    })
  },
  getSpuIdInfo(spuId) {
    return request({
      url: `${api_name}/getSpuById/${spuId}`,
      method: 'get'
    })
  },
  addOrUpdate(spuInfo) {
    return request({
      url: `${api_name}/${spuInfo.id ? 'updateSpuInfo' : 'saveSpuInfo'}`,
      method: 'post'
    })
  },
  getPageInfo(page, limit, category3Id) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      params: {category3Id},
      method: 'get'
    })
  }
}
