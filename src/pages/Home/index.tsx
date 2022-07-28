import Icon from '@/components/Icon'
import { Tabs } from 'antd-mobile'
import styles from './index.module.scss'
import { useInitialState } from '@/utils/use-initial-state'
import { getUserChannel } from '@/store/actions/home'
import ArticleList from './components/ArticleList'

const Home = () => {
  const { userChannels } = useInitialState(getUserChannel, 'home')
  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      {userChannels.length > 0 && (
        <Tabs className='tabs' activeLineMode='fixed'>
          {userChannels.map((item) => {
            return (
              <Tabs.Tab title={item.name} key={item.id}>
                {/* 放置文章列表 */}
                <ArticleList channelId={item.id}></ArticleList>
              </Tabs.Tab>
            )
          })}
        </Tabs>
      )}
      <div className='tabs-opration'>
        <Icon type='iconbtn_search' />
        <Icon type='iconbtn_channel' />
      </div>
    </div>
  )
}

export default Home
