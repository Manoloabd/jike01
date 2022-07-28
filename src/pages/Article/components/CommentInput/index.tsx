import { useEffect, useRef, useState } from 'react'
import { NavBar, TextArea } from 'antd-mobile'
import styles from './index.module.scss'
import { TextAreaRef } from 'antd-mobile/es/components/text-area'
import { useAuthSet } from '@/utils/use-initial-state'
// 该组件的两个使用场景：1 文章评论  2 评论回复

type Props = {
  name?: string
  onClose?: () => void
  onAddComment: (content: string) => void
}

const CommentInput = ({ name, onClose, onAddComment }: Props) => {
  const isAuth = useAuthSet() // 执行权限的验证及提示 要返回验证的结构
  const [value, setValue] = useState('')
  const textAreaRef = useRef<TextAreaRef>(null)

  useEffect(() => {
    textAreaRef.current?.focus()
  }, [])

  const onChange = (value: string) => {
    setValue(value)
  }
  if (!isAuth) {
    // 如果当前没有登录 又选择了放弃 可以返回空标签或者null 表示不渲染
    // 此时应该关闭外层的父组件  popup
    // 关闭弹层
    // setTimeout(() => onClose?.(), 0)
    new Promise((resolve) => resolve(true)).then(() => onClose?.())
    return null
  }
  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        right={
          <span
            className='publish'
            onClick={!!value ? () => onAddComment(value) : undefined}
          >
            发表
          </span>
        }
      >
        {name ? '回复评论' : '评论文章'}
      </NavBar>

      <div className='input-area'>
        {name && <div className='at'>@{name}:</div>}
        <TextArea
          ref={textAreaRef}
          placeholder='说点什么~'
          rows={10}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default CommentInput
