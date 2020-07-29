import request from '@/utils/request'

const api_name = '/admin/product'

export default {
  /**
   * 获取品牌分页列表(带搜索)
   *
   * GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  属性查询
   * DELETE /admin/product/deleteAttr/{attrId}  删除
   * POST /admin/product/saveAttrInfo  更新或增加
   */

  // 获取属性值
  getAttr(category1Id, category2Id, category3Id) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: 'get'
    })
  },
  // 删除属性
  delete(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: 'delete'
    })
  },
  // 增加或更新属性
  addOrUpdate(attr) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: 'post',
      data: attr
    })
  }
}
