import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef } from 'react'
import type { RootState } from '@/types/store'
import { Dialog } from "antd-mobile"
import { useHistory } from "react-router-dom"
// 创建一个函数 use开头
export const useInitialState  = <KeyName extends keyof RootState>(action: () => void , stateName: KeyName) => {
    const dispatch = useDispatch()
   const state =  useSelector((state: RootState) => state[stateName])
   // 返回的是 当前子reducer的状态
     // 第一次传入进来，就会赋值给ref
  const actionRef = useRef(action) // 得到一个ref对象 current不会根据当前 的函数重复执行而发生任何变化
    useEffect(() => {
     dispatch(actionRef.current())
    }, [dispatch]) // 每次都创建了一个新的函数
    return state 
}

// 检查当前的登录状态 如果没有登录 直接提示 点击登录 跳到登录页 点击放弃 就关闭 一切都没有发生
export const useAuthSet = () => {
  // token存于redux 和前端缓存
  const token = useSelector((state: RootState) => state.login.token) // 如果token为存在 为真 表示 可以继续 。不需要处理。
  const history = useHistory<{ from: string }>()
  useEffect(() => {
    // 进行token的判断
    if (!token) {
      // 提示用户，此时您要么放弃 要么去登录
      const handler = Dialog.show({
        title: "温馨提示",
        content: "亲，检测到您未登录，如需继续操作，需要进行去登录注册",
        actions: [
          [
            {
              key: "cancel",
              text: "去登录",
              onClick: () => {
                // 跳到登录页
                // handler.close()
                history.push("/login", {
                  from: history.location.pathname, // 传入当前的地址
                }) // 要回来，得传入当前的地址
              },
            },
            {
              key: "confirm",
              text: "放弃操作",
              style: {
                color: "var(--adm-color-weak)",
              },
              onClick: () => {
                handler.close() // 关闭弹层 什么也没发生过
              },
            },
          ],
        ],
      })
    }
  }, [history, token])
  return !!token
}


// 自定义hook处理退出时redux数据的清空问题

// 约束只能清理 redux中特定的 key
export const useResetRedux = <KeyName extends keyof RootState>(stateName: KeyName) => {
  const dispatch = useDispatch()
  // 处理数据 退出页面时处理
  useEffect(() => {
    return () => {
      // 此时 会在页面卸载时调用
      dispatch({ type: "reset", payload: stateName })
    } // eslint-disable-next-line
  }, [])
}