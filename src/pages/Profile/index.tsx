import { Link, useHistory } from 'react-router-dom'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { useInitialState } from '@/utils/use-initial-state'
import { getUser } from '@/store/actions/profile'

const Profile = () => {
  const history = useHistory()
  const { user: User } = useInitialState(getUser, 'profile')
  // 因为此时可以确认 profile是 rootState中一员 详细推导出了具体类型
  return (
    <div className={styles.root}>
      <div className='profile'>
        {/* 个人信息 */}
        <div className='user-info'>
          <div className='avatar'>
            <img src={User.photo} alt='' />
          </div>
          <div className='user-name'>{User.name}</div>
          <Link to='/profile/edit'>
            个人信息 <Icon type='iconbtn_right' />
          </Link>
        </div>

        {/* 今日阅读 */}
        <div className='read-info'>
          <Icon type='iconbtn_readingtime' />
          今日阅读
          <span>10</span>
          分钟
        </div>

        {/* 动态 - 对应的这一行 */}
        <div className='count-list'>
          <div className='count-item'>
            <p>{User.art_count}</p>
            <p>动态</p>
          </div>
          <div className='count-item'>
            <p>{User.follow_count}</p>
            <p>关注</p>
          </div>
          <div className='count-item'>
            <p>{User.fans_count}</p>
            <p>粉丝</p>
          </div>
          <div className='count-item'>
            <p>{User.like_count} </p>
            <p>被赞</p>
          </div>
        </div>

        {/* 消息通知 - 对应的这一行 */}
        <div className='user-links'>
          <div className='link-item'>
            <Icon type='iconbtn_mymessages' />
            <div>消息通知</div>
          </div>
          <div className='link-item'>
            <Icon type='iconbtn_mycollect' />
            <div>收藏</div>
          </div>
          <div className='link-item'>
            <Icon type='iconbtn_history1' />
            <div>浏览历史</div>
          </div>
          <div className='link-item'>
            <Icon type='iconbtn_myworks' />
            <div>我的作品</div>
          </div>
        </div>
      </div>

      {/* 更多服务 */}
      <div className='more-service'>
        <h3>更多服务</h3>
        <div className='service-list'>
          <div className='service-item'>
            <Icon type='iconbtn_feedback' />
            <div>用户反馈</div>
          </div>
          <div className='service-item' onClick={() => history.push('/chat')}>
            <Icon type='iconbtn_xiaozhitongxue' />
            <div>小智同学</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
