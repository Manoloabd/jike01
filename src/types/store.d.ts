//处理redux相关的类型
import store from '@/store'
import { ThunkAction } from 'redux-thunk'
import type { Token, User, UserProfile, Channel, Articles, ArticleInfo, ArticleComment} from './data'

export type RootState = ReturnType<typeof store.getState>

export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>

export type RootAction = LoginAction | UserAction | HomeAction | articleAction//所有action类型的集合

export type LoginAction = | {
    type: 'login/token',
    payload: Token
} | {
    type: 'login/logout'
}

export type UserAction = {
    type: 'user/getuser',
    payload: User
} | {
    type: 'user/getprofile',
    payload: UserProfile
} | {
    type: 'user/updata',
    payload:Partial<UserProfile>
}

export type HomeAction =
| {
    type: 'home/getUserChannel',
    payload:Channel[]
    }
| {
        type: 'home/getChannelArtciles'
        payload: {
            channel_id: number
            data: Articles
            actionType:'append' | 'replace'
        }
    }


export type ArticleAction = {
    type: 'article/get',
    payload:ArticleInfo
} | {
    type: 'article/getArticleComments'
    payload: ArticleComment & { actionType:'replace' | 'append'}
} | {
    type: "article/addArticleComment"
    payload: ArtComment // 要将最新发表的数据添加到评论的头部
  }