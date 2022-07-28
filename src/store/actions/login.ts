// 专门处理登录action的文件
import type { RootThunkAction } from '@/types/store'
import type { LoginForm, LoginResponse } from '@/types/data'
import { http } from '@/utils/http'
import { clearToken, setToken } from '@/utils/auth'  
// 异步请求action axios工具类 需要指定rootthunkaction类型  react-thunk
export const login = (loginParams: LoginForm): RootThunkAction => {
  return async (dispatch) => {
    //  执行请求 工具 请求地址  参数
    // 类型断言 非空断言  主观判断变量类型
    const res = (await http.post(
      "/authorizations",
      loginParams
    )) as LoginResponse
    // 得到了res 将得到的token进行存储
    setToken(res.data) // 类型进行了对应 写入前端缓存
    // redux 触发reducer  更新redux状态
    dispatch({ type: "login/token", payload: res.data }) // 这里为何没提示？ redux更新版本的一个缺陷
  }
}

//发送验证码的
export const sendCode = (mobile: string): RootThunkAction => {
  return async dispatch => {
    return http.get(`/sms/codes/${mobile}`)
  }

}
export const logout = ():RootThunkAction => {
  return dispatch => {
    dispatch ({ type: 'login/logout' })// eslint-disable-next-line
    clearToken()
  }
}