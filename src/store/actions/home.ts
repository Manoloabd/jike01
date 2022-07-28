import type { RootThunkAction } from "@/types/store"
import type { UserChannelResponse, Channel, ArticlesResponse } from "@/types/data"
import { http } from "@/utils/http"
// 导出一个获取用户频道的action
const Channel_Key = "geek-channels-138" // 创建一个极客园的key
export const getUserChannel = (): RootThunkAction => {
  return async (dispatch, getState) => {
    // 判断当前用户是否登录- 当前有没有token- redux-前端缓存
    let userChannels: Channel[] = [] // 定义一个变量 给一个具体类型
    const {
      login: { token },
    } = getState() // 获取到当前整个的redux状态
    if (!!token) {
      // 登录
      const {
        data: { channels },
      } = (await http.get("/user/channels")) as UserChannelResponse
      // console.log(channels) // 拿到了用户频道的数据
      userChannels = channels
    } else {
      // 未登录
      // 先去本地的缓存中读取频道数据
      const localChannels = JSON.parse(
        localStorage.getItem(Channel_Key) ?? "[]"
      ) as Channel[]
      if (localChannels.length > 0) {
        // 表示本地缓存有数据
        // console.log("未登录时, 本地缓存", localChannels)
        userChannels = localChannels
      } else {
        // 如果缓存中没有数据- 先发请求 - 获取默认的频道列表数据- 写到本地缓存
        const {
          data: { channels },
        } = (await http.get("/user/channels")) as UserChannelResponse
        // 此时此刻 拿到的channels是用户默认的数据
        localStorage.setItem(Channel_Key, JSON.stringify(channels)) // 写入前端缓存
        // console.log("写入前端缓存", channels)
        userChannels = channels
      }
    }
    // 此时可以确定拿到userChannels数据
    dispatch({ type: "home/getUserChannel", payload: userChannels }) // 派发reducers
  }
}

//获取用户频道文章数据的action
export const getArticleList = (channel_id:number,timestamp:string, actionType:'append' | 'replace'):RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get('/articles', {
      params: {
        channel_id,timestamp
      }
    }) as ArticlesResponse
    dispatch({type:'home/getChannelArtciles', payload:{channel_id, data:res.data,actionType}})
  }
}