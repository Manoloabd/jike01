import { NavBar, InfiniteScroll, Popup } from 'antd-mobile'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'
import styles from './index.module.scss'

import Icon from '@/components/Icon'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import { useParams } from 'react-router-dom'
import { getArticleInfo } from '@/store/actions/article'
import { useInitialState, useResetRedux } from '@/utils/use-initial-state'
import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import dompurify from 'dompurify'
import highlight from 'highlight.js'
import ContentLoader from 'react-content-loader'
import 'highlight.js/styles/vs2015.css'
import { getCommments } from '@/store/actions/article'
import NoneComment from '@/pages/Article/components/NoneComment' // 无评论时的显示组件
import CommentInput from './components/CommentInput'
import { AddArticleComment } from '@/store/actions/article'

// 评论的类型 a(文章类型) / c(评论的评论)
enum CommentType {
  Article = 'a',
  Comment = 'c',
}
dayjs.extend(LocalizedFormat) // 扩展转化方法
const Article = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  useResetRedux('article') // 表示页面退出时 需要清理artice下的数据
  const { articleId } = useParams<{ articleId: string }>() // 获取路由参数对象
  const { detail } = useInitialState(() => getArticleInfo(articleId), 'article') // 自定义hook调用文章详情
  // 自定义hook调用评论  先获取对于文章的评论- 替换整个的评论数据
  const { comment } = useInitialState(
    () => getCommments(CommentType.Article, articleId, null, 'replace'),
    'article'
  )
  const [commentVisible, setCommentVisible] = useState(false)
  const [showComment, setShowComment] = useState(false) // 用来控制是否显示评论区内容
  const wrapperRef = useRef<HTMLDivElement>(null) // 得到一个ref对象
  highlight.configure({
    ignoreUnescapedHTML: true,
  })
  const loadMoreComments = async () => {
    // 加载更多的评论 滚动到位置了 上一页的偏移量传进去
    await dispatch(
      getCommments(CommentType.Article, articleId, comment.last_id, 'append')
    )
    // 保证通过此函数可以得到结果
  }

  useEffect(() => {
    if (detail.art_id) {
      // 说明此时已经加载过文章详情了
      // 通过dom寻找所有的 带pre code的节点
      const dgHtmlDom = document.querySelector('.dg-html') // 获取对应的文本内容的dom
      const codeList = dgHtmlDom?.querySelectorAll<HTMLElement>('pre code') // 确定要找的是HtmlElement
      // 得到一个列表 有可能为空
      if (codeList && codeList.length > 0) {
        // 此时此刻表示 找到了 代码块
        // 需要使用 highlight让每个代码块高亮
        codeList.forEach((item) => {
          // 使用highlight
          highlight.highlightElement(item)
        })
      }
    }
  }, [detail])

  const showLoader = () => (
    <ContentLoader
      speed={2}
      width={400}
      height={360}
      viewBox='0 0 400 360'
      backgroundColor='#d56c6c'
      foregroundColor='#ecebeb'
    >
      <rect x='59' y='123' rx='3' ry='3' width='88' height='6' />
      <rect x='163' y='124' rx='3' ry='3' width='52' height='6' />
      <rect x='12' y='221' rx='3' ry='3' width='410' height='6' />
      <rect x='11' y='176' rx='3' ry='3' width='388' height='6' />
      <rect x='27' y='67' rx='3' ry='3' width='178' height='6' />
      <circle cx='30' cy='122' r='20' />
      <rect x='14' y='265' rx='0' ry='0' width='387' height='7' />
    </ContentLoader>
  )

  // 此方法负责定位滚动评论区
  const onScrollTop = () => {
    if (wrapperRef.current) {
      // 此时需要确定 滚动 滚动条
      if (showComment) {
        // 表示当前是显示 评论的 , 要去隐藏 将滚动条滚动到头部
        // wrapperRef.current
        // 流程控制分析
        wrapperRef.current.scrollTop = 0 // 滚动到最上方
      } else {
        // 此时表示不显示评论 要去显示  将滚动条滚动到固定位置
        const contentDom =
          wrapperRef.current.querySelector<HTMLDivElement>('.article-wrapper')
        // wrapperRef.current.scrollTop = 0 // 滚动到最上方
        if (contentDom) {
          wrapperRef.current.scrollTop = contentDom.offsetHeight + 45 // 将评论区滚出页面
        }
      }
      setShowComment(!showComment) // 切换当前的状态
    }
  }
  //发表评论
  const publishComment = async (content: string) => {
    await dispatch(AddArticleComment(articleId, content))
    //成功后关闭
    setCommentVisible(false)
  }

  const {
    title,
    read_count,
    like_count,
    comm_count,
    pubdate,
    aut_name,
    aut_photo,
    is_followed,
    content,
  } = detail
  const renderArticle = () => {
    // 文章详情
    return (
      <div className='wrapper' ref={wrapperRef}>
        <div className='article-wrapper'>
          <div className='header'>
            <h1 className='title'>{title}</h1>

            <div className='info'>
              {/* 转化成专用格式 */}
              <span>{dayjs(pubdate).format('LL')}</span>
              <span>{read_count} 阅读</span>
              <span>{comm_count} 评论</span>
            </div>

            <div className='author'>
              <img src={aut_photo} alt='' />
              <span className='name'>{aut_name}</span>
              <span
                className={classNames('follow', is_followed ? 'followed' : '')}
              >
                {is_followed ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          <div className='content'>
            {/* 完成富文本内容的消毒 */}
            <div
              className='content-html dg-html'
              dangerouslySetInnerHTML={{ __html: dompurify.sanitize(content) }}
            />
            <div className='date'>
              发布文章时间：{dayjs(pubdate).format('LL')}
            </div>
          </div>
        </div>

        <div className='comment'>
          <div className='comment-header'>
            <span>全部评论（{comm_count}）</span>
            <span>{like_count} 点赞</span>
          </div>
          {/* 文章列表 */}
          {comment.results.length > 0 ? (
            <div className='comment-list'>
              {/* 渲染评论列表 */}
              {comment.results.map((item) => {
                // 将所有的属性全部传过去
                return <CommentItem key={item.com_id} {...item} />
              })}
              {/* harMore应该是动态 */}
              <InfiniteScroll
                hasMore={comment.last_id !== comment.end_id}
                loadMore={loadMoreComments}
              />
            </div>
          ) : (
            <NoneComment />
          )}
        </div>
      </div>
    )
  }
  //生成平路弹层
  const renderCommentPopup = () => {
    return (
      <Popup
        destroyOnClose
        className='reply-popup'
        position='right'
        visible={commentVisible}
      >
        <div className='comment-popup-wrapper'>
          <CommentInput
            onAddComment={publishComment}
            onClose={() => setCommentVisible(false)}
          ></CommentInput>
        </div>
      </Popup>
    )
  }
  if (!detail.art_id) {
    // 如果当前没有id 表示表示加载数据 显示骨架屏
    return showLoader()
  }
  return (
    <div className={styles.root}>
      <div className='root-wrapper'>
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span>
              <Icon type='icongengduo' />
            </span>
          }
        >
          {true && (
            <div className='nav-author'>
              <img src='http://geek.itheima.net/images/user_head.jpg' alt='' />
              <span className='name'>黑马先锋</span>
              <span className={classNames('follow', true ? 'followed' : '')}>
                {true ? '已关注' : '关注'}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}
        {/* 渲染评论弹层 */}
        {renderCommentPopup()}
        {/* 底部评论栏 */}
        <CommentFooter
          onScrollTop={onScrollTop}
          onCommentPopup={() => setCommentVisible(true)}
        />
      </div>
    </div>
  )
}

export default Article
