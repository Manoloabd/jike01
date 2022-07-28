import { HomeAction } from "@/types/store"
import { Articles, Channel } from "@/types/data"

type HomeState = {
  userChannels: Channel[]
  channelArticles: {
    [key in number]:Articles
  }
  // 添加频道文章的数据结构 {1：{}， 2：{}}
}
const inititalState: HomeState = {
  // 表示首页数据的初始状态
  userChannels: [], // 一开始 用户频道是空数组
  channelArticles: {}
  
}

export default function Home(
  state = inititalState,
  action: HomeAction
): HomeState {
  switch (action.type) {
    case "home/getUserChannel":
      // 更新用户频道数据
      return { ...state, userChannels: action.payload }
      case "home/getChannelArtciles":
        // 解构 传过来的载荷参数
        const {
          channel_id,
          data: { pre_timestamp, results },
          actionType
        } = action.payload
        // 读取原来的参数
        const preArticles = state.channelArticles[channel_id]
          ? state.channelArticles[channel_id].results
          : []
  
        return {
          ...state,
          channelArticles: {
            ...state.channelArticles,
            [channel_id]: {
              pre_timestamp,
              results: actionType === 'append' ? [...preArticles, ...results] : [...results], //  results: [ 原来的数据 ,...results],
            },
          },
        }
    default:
      return state
  }
}