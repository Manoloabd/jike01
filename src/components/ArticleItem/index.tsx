import classnames from 'classnames'

import Icon from '@/components/Icon'

import styles from './index.module.scss'

import { useHistory } from 'react-router-dom'

import dayjs from 'dayjs' // 引入主包

import relativeTime from 'dayjs/plugin/relativeTime'

import 'dayjs/locale/zh-cn' // 引入语言包

dayjs.locale('zh-cn') // 全局配置语言包

dayjs.extend(relativeTime) // 集成时间到主包

type Props = {
  /**
   * 0 表示无图
   * 1 表示单图
   * 3 表示三图
   */
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
}

const ArticleItem = ({
  cover,
  title,
  aut_name,
  comm_count,
  pubdate,
  art_id,
}: Props) => {
  const history = useHistory() // 得到history对象
  return (
    // 跳转到文章详情
    <div
      className={styles.root}
      onClick={() => history.push(`/article/${art_id}`)}
    >
      <div
        className={classnames(
          'article-content',
          cover.type === 3 && 't3',
          cover.type === 0 && 'none-mt'
        )}
      >
        <h3>{title}</h3>
        {cover.type !== 0 && (
          <div className='article-imgs'>
            {/*在这里渲染图片的封面 */}
            {cover.images.map((item, index) => {
              return (
                <div className='article-img-wrapper' key={index}>
                  <img src={item} alt='' />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div
        className={classnames('article-info', cover.type === 0 && 'none-mt')}
      >
        <span>{aut_name}</span>
        <span>{comm_count} 评论</span>
        <span>{dayjs().from(dayjs(pubdate))}</span>
        <span className='close'>
          <Icon type='iconbtn_essay_close' />
        </span>
      </div>
    </div>
  )
}

export default ArticleItem
