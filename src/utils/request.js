/**
 * 请求模块
 */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过
  // config：本次请求的配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 务必要返回config配置对象
  return config
}, function (error) {
  // 请求出错会进入
  return Promise.reject(error)
})

// 响应拦截器

export default request
