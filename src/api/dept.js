import request from '@/utils/request'

export default {

  getUnitInfo() {
    return request({
      url: '/dept/info/list',
      method: 'get',
    })
  }
}
