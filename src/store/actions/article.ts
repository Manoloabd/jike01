// 新建详情的action
import { RootThunkAction } from "@/types/store"
import { http } from "@/utils/http"
import { ArticleInfoResponse, ArticleCommentResponse, AddArticleResposnse } from "@/types/data"

// 获取文章详情
export const getArticleInfo = (articleId: string): RootThunkAction => {
  return async (dispatch) => {
    // redux-thunk-action
    // http发起请求
    // http
    const res = (await http.get(`/articles/${articleId}`)) as ArticleInfoResponse // 强制转化
    // 得到res之后，分发reducer
    dispatch({ type: "article/get", payload: res.data })
  }
}
/**
 *  定义获取评论的action
 *
 * **/
export const getCommments = (type: string, source: string, offset: string | null, actionType: "append" | "replace"): RootThunkAction => {
  return async (dispatch) => {
    // 发起请求
    const res = (await http.get("/comments", {
      params: {
        type,
        source,
        offset,
      },
    })) as ArticleCommentResponse // 类型断言
    // 触发Action
    dispatch({ type: "article/getArticleComments", payload: { ...res.data, actionType } })
  }
}
/***
 *  定义发表评论的方法
 * target-要评论的文章id
 * content-要评论的内容
 * ***/

export const AddArticleComment = (target: string, content: string): RootThunkAction => {
  return async (dispatch) => {
    // 发表评论
    const res = (await http.post("/comments", {
      target,
      content,
    })) as AddArticleResposnse
    // res.data  这里就可以去分发数据了
    // res.data
    dispatch({ type: "article/addArticleComment", payload: res.data.new_obj })
    // 分发reducer
  }
}
