import ArticleItem from '@/components/ArticleItem'
import { InfiniteScroll, PullToRefresh } from 'antd-mobile'
import styles from './index.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getArticleList } from '@/store/actions/home'
import { RootState } from '@/types/store'
type Props = {
  channelId: number
}

const ArticleList = ({ channelId }: Props) => {
  const dispatch = useDispatch()
  // const [hasMore] = useState(true) //  需要根据当前的历史时间戳来判定
  // // 首先得判断当前是不是第一次加载？、

  const articles = useSelector((state: RootState) => state.home.channelArticles)
  // 如果是空的 ，表示频道数据从来没有加载过
  // 肯定要发起第一次请求,传入当前最新的时间戳 -- 如果不是空的，读取此数据里面的 pre_timestamp
  const { results, pre_timestamp } = articles[channelId] ?? {
    pre_timestamp: Date.now().toString(), // 如果是第一次请求，就认为默认取当前时间
    results: [],
  }
  // 此时可以保证pre_timestamp 至少有值
  // 当 pre_timestamp为空时, 不能再继续加载
  const hasMore = !!pre_timestamp

  const loadMore = async () => {
    // 发起请求
    await dispatch(getArticleList(channelId, pre_timestamp, 'append')) // 追加
  }
  // 下拉刷新触发的函数
  const onRefresh = async () => {
    // 此时应该 拉取数据
    await dispatch(getArticleList(channelId, Date.now().toString(), 'replace')) // 替换
  }
  return (
    <div className={styles.root}>
      <PullToRefresh onRefresh={onRefresh}>
        {/* 文章列表中的每一项 */}
        {/* <div className="article-item">
        <ArticleItem type={1} />
      </div> */}
        {results.map((item) => {
          return <ArticleItem {...item} key={item.art_id} />
        })}
        {/* 无限滚动组件 */}
        <InfiniteScroll hasMore={hasMore} loadMore={loadMore}></InfiniteScroll>
      </PullToRefresh>
    </div>
  )
}

export default ArticleList
