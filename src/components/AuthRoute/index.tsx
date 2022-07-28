import { getToken } from '@/utils/auth'
import { Route, Redirect } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
// 封装类似Route的组件
const AuthRoute = ({ children, ...rest }: any) => {
  // children表示  <AuthRoute>{ 内容 }</AuthRoute>
  // 要判断当前有没有token
  // 如果有token 权限路由 是允许它里面的组件渲染的
  // 如果没有token 不允许渲染 - 跳转到登录页
  //  Route  render属性  当匹配地址的之后 会执行render函数
  const location = useLocation()
  return (
    <Route
      {...rest}
      render={() => {
        // 在这进行判断 有token 没有token
        if (isAuth()) {
          // 如果有token  此时应该放过  有权访问的
          return children
        }
        // 没有token 跳转到登录页
        return (
          <Redirect
            to={{
              pathname: '/login',
              state: {
                // 将从哪个页面跳过去的参数传到登录页
                from: location.pathname,
              },
            }}
          />
        )
      }}
    ></Route>
  )
}
// 检查token是否存在
const isAuth = (): boolean => {
  // 因为token有可能是空字符串
  return !!getToken().token
}
export default AuthRoute
