import type { ArticleAction } from "@/types/store"
import type { ArticleInfo, ArticleComment } from "@/types/data" // 引入文章详情类型
type ArticleState = {
  detail: ArticleInfo // 文章详情
  comment: ArticleComment // 评论类型 记录 最后一个id  resutls
}
// 此时 需要考虑 存储结构  { 文章详情, 评论数据 }
const inititalState: ArticleState = {
  detail: {}, // 文章详情
  // 评论
  comment: {
    results: [] as ArticleComment["results"], // 评论的列表为一个空数组
  },
  // comment:
} as ArticleState // 类型断言是主观上的一种判断 屏蔽ts的错 会有对应提示

export default function article(state = inititalState, action: ArticleAction): ArticleState {
  switch (action.type) {
    case "article/get":
      return { ...state, detail: action.payload } // 更新文章详情数据
    case "article/getArticleComments":
      // 拿到评论数据之后， 不是完全覆盖 要做追加
      // 要考虑第一次请求的时候- 进入到文章详情的时候-做第一次加载-覆盖原来的数据
      const { total_count, results, last_id, end_id, actionType } = action.payload
      return {
        ...state,
        comment: {
          total_count, // 总数要替换
          end_id,
          last_id,
          results: actionType === "append" ? [...state.comment.results, ...results] : [...results], // 需要做追加
        },
      }
    case "article/addArticleComment":
      // 只要走到这个位置 就可以确定 总评论数 多了1条
      return {
        ...state,
        comment: {
          ...state.comment,
          total_count: state.comment.total_count + 1, // 总数+1
          results: [action.payload, ...state.comment.results], // 评论列表
          // 直接在评论列表头部加一条记录即可
        },
        detail: {
          ...state.detail,
          comm_count: state.detail.comm_count + 1, // 在原来文章的基础上也加1
        },
      }
    default:
      return state
  }
}
