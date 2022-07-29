import { Input, NavBar } from 'antd-mobile'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { io, Socket } from 'socket.io-client'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { getToken } from '@/utils/auth'
type ChatRecord = {
  type: 'xz' | 'user'
  message: string
}
const Chat = () => {
  const history = useHistory()
  // 需要 一开始 就 先让小智说两句  聊天记录是一个数组
  const [chatList, setChatList] = useState<ChatRecord[]>([])
  const [value, setValue] = useState('')
  const socketRef = useRef<Socket>() // 使用ref指定泛型类型
  const listRef = useRef<HTMLDivElement>(null)
  // 可以使用useRef
  //  建立通讯链接
  useEffect(() => {
    // 尝试建立websocket通讯链接
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
          message: '欢迎来到黑马程序员',
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
      // console.log(chatList)
    })
    socketIO.on('disconnect', () => {
      console.log('和极客园小智同学断开连接')
    })
    return () => {
      socketIO.close()
    }
  }, [])
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
  // 需要监听 聊天数组的变化
  // useEffect
  useLayoutEffect(() => {
    // 监听数组的变化 数组一变化 页面渲染完毕
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current?.scrollHeight // 滚动到最底部
    }
  }, [chatList])
  return (
    <div className={styles.root}>
      <NavBar className='fixed-header' onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      <div className='chat-list' ref={listRef}>
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
