import { Input, NavBar } from 'antd-mobile'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { getToken } from '@/utils/auth'
type ChatRecord = {
  type: 'xz' | 'user'
  message: string
}
const Chat = () => {
  const history = useHistory()
  const [chatList, setChatList] = useState<ChatRecord[]>([])
  const [value, setValue] = useState('')
  //  建立通讯链接
  useEffect(() => {
    const socketIO = io('http://toutiao.itheima.net', {
      query: {
        token: getToken().token,
      },
      transports: ['websocket'],
    })
    // 监听connect事件
    socketIO.on('connect', () => {
      console.log('和极客园小智同学连接成功')
      setChatList([
        {
          type: 'xz',
          message: '欢迎来到聊天室',
        },
        {
          type: 'xz',
          message: '请说点什么吧',
        },
      ])
    })
    socketIO.on('disconnect', () => {
      console.log('和极客园小智同学断开连接')
    })
    return () => {
      socketIO.close()
    }
  }, [])
  return (
    <div className={styles.root}>
      <NavBar className='fixed-header' onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      <div className='chat-list'>
        {/* 循环生成聊天记录 */}
        {chatList.map((item, index) => {
          return (
            <div
              className={classnames(
                'chat-item',
                item.type === 'xz' ? 'self' : 'user'
              )}
              key={index}
            >
              {item.type === 'xz' ? (
                <Icon type='iconbtn_xiaozhitongxue' />
              ) : (
                <img
                  src='http://geek.itheima.net/images/user_head.jpg'
                  alt=''
                />
              )}
              <div className='message'>{item.message}</div>
            </div>
          )
        })}
      </div>

      <div className='input-footer'>
        <Input
          className='no-border'
          placeholder='请描述您的问题'
          value={value}
          onChange={setValue}
        />
        <Icon type='iconbianji' />
      </div>
    </div>
  )
}

export default Chat
