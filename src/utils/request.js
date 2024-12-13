import axios from 'axios'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import router from '@/router/index'
import pinia from '@/store/pinia'
import {useUserDataStore} from '@/store/index'
import errorCode from '@/utils/errorCode'

const userDataStore = useUserDataStore(pinia)

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
//创建axios实例
const service = axios.create({
  baseURL: userDataStore.baseURL,
  timeout: 10000
})

//request拦截器
service.interceptors.request.use(config => {
  //是否需要设置 token
  const isToken = Boolean(config.headers.isToken)

  if (userDataStore.token && isToken) {
    //让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['token'] = userDataStore.token
  }
  //get请求url转义编码拼装params参数
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName of Object.keys(config.params)) {
      //判断值是基础类型
      const value = config.params[propName]
      if (value !== null && typeof value !== 'undefined' && typeof value !== 'object') {
        const part = encodeURIComponent(propName) + '='
        url += part + encodeURIComponent(value) + '&'
      }
      //判断值是对象类型
      if (value !== null && typeof value !== 'undefined' && typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && typeof (value[key]) !== 'undefined') {
            const params = propName + '[' + key + ']'
            const subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } 
    }
    //去掉末尾的&
    url = url.slice(0, -1)
    //清空配置
    config.params = {}
    config.url = url
  }
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
  // 未设置状态码则默认成功状态
  const code = res.data.code || 200
  // 获取错误信息
  const msg = errorCode[code] || res.data.msg || errorCode['default']
  if (code === 401) {
    ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
      confirmButtonText: '重新登录',
      cancelButtonText: '取消',
      type: 'warning'
    }
    ).then(() => {
      localStorage.setItem('logUrl', router.currentRoute.fullPath);
      router.push({
        path: '/Login?login=1'
      });
    }).catch(() => {

      })
  return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
  
  } else if (code === 500) {
    ElMessage({
      message: msg,
      type: 'error'
    })
  return Promise.reject(msg)

  } else if (code !== 200) {
    ElNotification({
      title: msg,
      type: error
    })
  return Promise.reject('error')

  } else {
    //预处理
    // 把字符串total 转换成 数字 total
    if (res.data.data && res.data.data.total) {
      res.data.data.total = parseInt(res.data.data.total)
    }
    return res.data.data
  }
},
  error => {
    console.log('err' + error)
    let { message } = error
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    }
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    })
  return Promise.reject(error)
  }
)

export default service