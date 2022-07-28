//处理数据结构

//定义登录/注册接口返回的数据类型
export type Token = {
    token: string,
    refresh_token:string
}
 
//定义一个提交表单的类型
export type LoginForm = {
    mobile: string,
    code: string
}

//定义一个登录接口返回的数据结构
export type LoginResponse = ApiResponse<Token>
//用户类型
export type User = {
    id: string,
    name: string,
    photo: string,
    intro: string,
    art_count: number,
    follow_count: number,
    fans_count: number,
    like_count: number
}

export type UserResponse = ApiResponse<User>

type ApiResponse<T> = {
    message: string,
    data: T
}

export type UserProfile = {
    id: string,
    name: string,
    photo: string,
    mobile: string,
    gender: number,
    birthday: string,
    intro?: string
}
export type UserProfileResponse = ApiResponse<UserProfile>

//频道
export type Channel = {
    id: number
    name:string
}
export type UserChannel = {
    channels:Array<Channel>
}
export type UserChannelResponse = ApiResponse<UserChannel>

// 定义文章列表的数据结构
export type Articles = {
    pre_timestamp: string
    results: {
      art_id: string
      title: string
      aut_id: string
      aut_name: string
      comm_count: number // 评论数量
      pubdate: string
      cover: {
        type: number
        images: string[]
      }
    }[]
  }
  // 定义接口返回类型
export type ArticlesResponse = ApiResponse<Articles>
  
// 定义文章详情的结构
export type ArticleInfo = {
    art_id: string
    title: string
    pubdate: string
    aut_id: string
    aut_name: string
    aut_photo: string
    is_followed: boolean
    attitude: number
    content: string
    is_collected: boolean
    read_count: number
    like_count: number
    comm_count:number
  }
export type ArticleInfoResponse = ApiResponse<ArticleInfo>
  
  // 定义一个评论对象的类型
  
  export type ArtComment = {
    com_id: string
    aut_id: string
    aut_name: string
    aut_photo: string
    like_count: number
    reply_count: number
    pubdate: string
    content: string
    is_liking: boolean
    is_followed: boolean
  }
  // 文章评论的类型
  export type ArticleComment = {
    total_count: number
    end_id: string | null // 表示所有评论的最后一个id
    last_id: string | null // 当前页的最后一个id
    results: ArtComment[]
  }
export type ArticleCommentResponse = ApiResponse<ArticleComment>
export type AddArticleComment = {
  target: string
  com_id: string
  new_obj: ArtComment
}

export type AddArticleResposnse = ApiResponse<AddArticleComment>