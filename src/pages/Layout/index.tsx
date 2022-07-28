import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import styles from './index.module.scss'

import Icon from '@/components/Icon'
import { useHistory, useLocation } from 'react-router-dom'
// 导入页面组件，配置路由
import Home from '@/pages/Home'
import Question from '@/pages/Question'
import Video from '@/pages/Video'
import Profile from '@/pages/Profile'
import AuthRoute from '@/components/AuthRoute'

const tabs = [
  { path: '/home/index', icon: 'iconbtn_home', text: '首页' },
  { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
  { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
  { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' },
]

const Layout = () => {
  const history = useHistory()
  // useLocation 获取路由信息
  const location = useLocation()
  const changeTabBar = (key: string) => {
    // console.log(key)
    history.push(key)
  }
  return (
    <div className={styles.root}>
      {/* 二级嵌套路由 */}
      <Route exact path='/home/index'>
        <Home></Home>
      </Route>
      <Route path='/home/question'>
        <Question></Question>
      </Route>
      <Route path='/home/video'>
        <Video></Video>
      </Route>
      <AuthRoute path='/home/profile'>
        <Profile></Profile>
      </AuthRoute>

      <TabBar
        activeKey={location.pathname}
        className='tab-bar'
        onChange={changeTabBar}
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.path}
            icon={(active: boolean) => (
              <Icon
                type={active ? `${item.icon}_sel` : item.icon}
                className='tab-bar-item-icon'
              />
            )}
            title={item.text}
          />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout
