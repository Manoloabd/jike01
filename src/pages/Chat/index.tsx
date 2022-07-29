import { Input, NavBar } from 'antd-mobile'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { io, Socket } from 'socket.io-client'
import { useEffect, useState, useRef } from 'react'
import { getToken } from '@/utils/auth'
type ChatRecord = {
  type: 'xz' | 'user'
  message: string
}
const Chat = () => {
  const history = useHistory()
  const [chatList, setChatList] = useState<ChatRecord[]>([])
  const [value, setValue] = useState('')
  const socketRef = useRef<Socket>() // 使用ref指定泛型类型
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
      socketRef.current = socketIO // 在连接成功的时候 赋值给ref的current属性
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
    socketIO.on('message', (data) => {
      // 小智回了消息
      setChatList((list) => [...list, { message: data.msg, type: 'xz' }])
      // setChatList()
      console.log(chatList)
    })
    socketIO.on('disconnect', () => {
      console.log('和极客园小智同学断开连接')
    })
    return () => {
      socketIO.close()
    }
  }, [chatList])
  // 定义发送消息的一个方法
  const sendMessage = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 当键盘按下时 触发
    if (event.code === 'Enter' && !!value.trim()) {
      // 此时表示 既回车 又有内容 可以直接发送
      socketRef.current?.emit('message', {
        msg: value.trim(),
        timestamp: Date.now().toString(),
      })
      // 将自己的说的话 添加聊天内容
      setChatList([
        ...chatList,
        {
          type: 'user',
          message: value.trim(),
        },
      ])
      // 此时消息发完了
      setValue('') // 清空输入框
    }
  }
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
          onKeyDown={sendMessage}
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
