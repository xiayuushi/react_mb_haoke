import axios from 'axios'
import { BASEURL } from './constant'

const instance = axios.create({
  baseURL: BASEURL
})

instance.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error)
})

export default (url, method = 'get', payload) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get'? 'params' : 'data']: payload
  })
}