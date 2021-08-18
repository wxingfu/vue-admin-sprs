import request from '@/utils/request'

export default {

  getRectifyItems(page, limit, rectifyInfo) {
    return request({
      url: `/rectify/info/${page}/${limit}`,
      method: 'post',
      data: rectifyInfo
    })
  },

  addRectifyItem(item) {
    return request({
      url: `/rectify/info/add`,
      method: 'post',
      data: item
    })
  },

  getRectifyItemById(Id) {
    return request({
      url: `/rectify/info/get/${Id}`,
      method: 'get',
    })
  },

  updateRectifyItemById(item) {
    return request({
      url: `/rectify/info/update`,
      method: 'post',
      data: item
    })
  },

  removeRectifyItemById(Id) {
    return request({
      url: `/rectify/info/remove/${Id}`,
      method: 'delete',
    })
  },

  addRectifiedItem(item) {
    return request({
      url: `/rectify/info/rectified`,
      method: 'post',
      data: item
    })
  },

  addVerifiedItem(item) {
    return request({
      url: `/rectify/info/verified`,
      method: 'post',
      data: item
    })
  },

  signName(rid, name) {
    return request({
      url: `/rectify/info/signName`,
      method: 'post',
      params: {
        rid, name
      }
    })
  },

  excelImport(items) {
    return request({
      url: `/file/excel/import`,
      method: 'post',
      data: items
    })
  },
  removeSelected(rids) {
    return request({
      url: `/rectify/info/remove/selected?rids=${rids.toString()}`,
      method: 'delete',
    })
  }
}
