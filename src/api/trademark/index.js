import request from '@/utils/request'

const api_name = '/admin/product/baseTrademark'

export default {
  /**
   * 获取品牌分页列表(带搜索)
   *
   * GET /admin/product/baseTrademark/get/{id}  单个查询
   * GET /admin/product/baseTrademark/{page}/{limit}  分页查询
   * DELETE /admin/product/baseTrademark/remove/{id}  删除
   * PUT /admin/product/baseTrademark/update  更新
   * POST /admin/product/baseTrademark/save   增加
   *
   */

  getOnlyOne(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: 'get'
    })
  },
  getPageList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'get'
    })
  },
  delete(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: 'delete'
    })
  },
  addOrUpdate(trademark) {
    if (trademark.id) {
      return request({
        url: `${api_name}/update`,
        method: 'put',
        data: trademark
      })
    } else {
      return request({
        url: `${api_name}/save`,
        method: 'POST',
        data: trademark
      })
    }
  }
}
