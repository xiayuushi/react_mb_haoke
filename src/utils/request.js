import axios from 'axios'
import { BASEURL } from './constant'

import { getToken, removeToken } from './auth'

const instance = axios.create({
  baseURL: BASEURL
})

instance.interceptors.request.use(config => {
  if (config.url.startsWith('/user') && !config.url.startsWith('/user/registered') && !config.url.startsWith('/user/login')) {
    config.headers.authorization = getToken()
  }
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  if (response.data.status === 400) {
    removeToken()
  }
  return response.data
}, error => {
  return Promise.reject(error)
})

const request = (url, method = 'get', payload, headers) => {
  return instance({
    url,
    method,
    headers,
    [method.toLowerCase() === 'get'? 'params' : 'data']: payload
  })
}

export default request

// 1、除了注册以及登录之外的以'/user'开头的接口都需要添加请求头携带token， 因此在请求拦截器中只要需要携带token的接口都自动添加上
// -、后续就无需在每一个需要携带token的地方，一个一个的手动添加了（此步骤完成后，后续在发送请求时，就无需手动添加请求头携带token）
// 2、String.prototype.startsWith() 以xx开头的字符串，之所以不采用'==='全等来判断，是防止接口拼接参数的情况导致无法正确匹配
// 3、如果响应状态码是400，说明响应行失败，则移除token，后续就不需要在接口请求失败时手动移除token了
