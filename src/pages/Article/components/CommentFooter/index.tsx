import Icon from '@/components/Icon'
import styles from './index.module.scss'
import type { ArticleInfo } from '@/types/data'

type Props = Partial<ArticleInfo> & {
  // normal 普通评论
  // reply 回复评论
  type?: 'normal' | 'reply'
  onCommentPopup: () => void
  onScrollTop: () => void
}

const CommentFooter = ({
  type = 'normal',
  onCommentPopup,
  onScrollTop,
  comm_count,
  attitude,
  is_collected,
}: Props) => {
  return (
    <div className={styles.root}>
      <div className='input-btn' onClick={onCommentPopup}>
        <Icon type='iconbianji' />
        <span>抢沙发</span>
      </div>

      {type === 'normal' && (
        <>
          <div className='action-item' onClick={onScrollTop}>
            <Icon type='iconbtn_comment' />
            <p>评论</p>
            {!!comm_count && <span className='bage'>{comm_count}</span>}
          </div>
          <div className='action-item'>
            <Icon
              type={attitude === 1 ? 'iconbtn_like_sel' : 'iconbtn_like2'}
            />
            <p>点赞</p>
          </div>
          <div className='action-item'>
            <Icon
              type={is_collected ? 'iconbtn_collect_sel' : 'iconbtn_collect'}
            />
            <p>收藏</p>
          </div>
        </>
      )}

      {type === 'reply' && (
        <div className='action-item'>
          <Icon type={true ? 'iconbtn_like_sel' : 'iconbtn_like2'} />
          <p>点赞</p>
        </div>
      )}

      <div className='action-item'>
        <Icon type='iconbtn_share' />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
