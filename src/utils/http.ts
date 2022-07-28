import axios, { AxiosError } from "axios"
import store from '@/store'
import { Toast } from 'antd-mobile'
import { customHistory } from './history'
import { setToken, clearToken } from "./auth"
const http = axios.create({
  baseURL: 'http://toutiao.itheima.net/v1_0',
  timeout: 5000
})

//请求拦截器
http.interceptors.request.use(config => {
  let { login: { token } } = store.getState()

  if (!config.url?.startsWith('/authorizations')) {
    config.headers!.Authorization = `Bearer ${token}`
  }
  return config
}, error => Promise.reject(error))

//响应拦截器
http.interceptors.response.use(
  (response) => {
    // axios默认多加了一层data  这里直接解构 返回data
    return response.data ? response.data : {}
  },
  async (error: AxiosError) => {
    // 这里需要处理异常 出现问题 后台报错 提示报错信息
    // response  401 400 402 502
    if (error.response?.status === 401) {      try {
      // 401状态表示 token失效 或者登录失败 或者token不存在
      // 尝试换取token 获取refresh_token redux 、 前端缓存
      let {
        login: { refresh_token },
      } = store.getState() // 拿到token
      // 需要判断一下 refresh_token 有值
      if (!refresh_token) {
        // 如果没值? 连换token的权限也没有了， 此时应该阻止 进入catch
        await Promise.reject(error) //为了进入catch
      }
      // 此时绝对不能使用封装的http
      const {
        data: {
          data: { token },
        },
      } = await axios({
        url: "http://toutiao.itheima.net/v1_0/authorizations",
        method: "put",
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      })
      const TokenObj = {
        token, // 新换来的令牌
        refresh_token, // 用来换令牌的永久的良药
      }
      // 拿到token  前端缓存 redux  token都废掉
      setToken(TokenObj) // 同步到前端缓存
      store.dispatch({ type: "login/token", payload: TokenObj }) // 同步到redux
      // 发起请求 报错了 => 换了token => 继续把错误的请求处理掉
      // error.config // 上一次的请求的配置信息
      // axios http
      return http(error.config) // 重新发起之前错误的请求  如果能够正常发起
      // 出错 => error => 401 => 换token => 重新发起 => 正确
    } catch (error) {
      // 只要进入这里 说明 出错 => 401 => 换token  => 彻底失败
      // 一切重来 - 把之前的token refesh_token全都清除 redux 和 前端缓存
      clearToken() // 清空前端缓存
      store.dispatch({ type: "login/logout" }) // 清除redux中的token
      Toast.show({
        content: "登录超时, 请重新登录",
        duration: 1000,
        afterClose: () => {
          // 跳转到登录页- 可以携带上当前页面的地址
          customHistory.push("/login", {
            from: customHistory.location.pathname, // 获取当前的页面地址
          })
        },
      })
    }
  }
  // axios的错误的处理error对象中有 返回的reponse对象
  return Promise.reject(error)
}
)

export { http }


