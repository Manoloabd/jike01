import {
  Button,
  List,
  DatePicker,
  NavBar,
  Popup,
  Toast,
  Dialog,
} from 'antd-mobile'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import styles from './index.module.scss'
import { getUserProfile } from '@/store/actions/profile'
import { useInitialState } from '@/utils/use-initial-state'
import EditInput from './components/EditInput'
import { useState } from 'react'
import { updataUserProfile } from '@/store/actions/profile'
import { useDispatch } from 'react-redux'
import { logout } from '@/store/actions/login'
const Item = List.Item

const ProfileEdit = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { profile: UserProfile } = useInitialState(getUserProfile, 'profile')
  const [inputVisible, setInputVisible] = useState(false)
  //关闭修改窗口
  const onInputHide = () => {
    setInputVisible(false)
  }
  const onSave = async (name: string) => {
    await dispatch(updataUserProfile({ name }))
    Toast.show('更新成功啦')
    //提交后关闭
    onInputHide()
  }

  const logoutFrom = () => {
    const handler = Dialog.show({
      title: '提示',
      content: '是否要退出吗',
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
            onClick: () => {
              handler.close()
            },
          },
          {
            key: 'confirm',
            text: '退出',
            style: {
              color: 'var(--adm-color-weak)',
            },
            onClick: () => {
              dispatch(logout())
              handler.close()
              history.replace('/login')
            },
          },
        ],
      ],
    })
  }
  return (
    <div className={styles.root}>
      <div className='content'>
        {/* 标题 */}
        <NavBar
          onBack={() => history.goBack()}
          style={{
            '--border-bottom': '1px solid #F0F0F0',
          }}
        >
          个人信息
        </NavBar>

        <div className='wrapper'>
          {/* 列表 */}
          <List className='profile-list'>
            {/* 列表项 */}
            <Item
              extra={
                <span className='avatar-wrapper'>
                  <img width={24} height={24} src={UserProfile.photo} alt='' />
                </span>
              }
              arrow
            >
              头像
            </Item>
            <Item
              arrow
              extra={UserProfile.name}
              onClick={() => setInputVisible(true)}
            >
              昵称
            </Item>
            <Item
              arrow
              extra={
                <span className={classNames('intro', 'normal')}>
                  {UserProfile.intro || '未填写'}
                </span>
              }
            >
              简介
            </Item>
          </List>

          <List className='profile-list'>
            <Item arrow extra={UserProfile.gender === 0 ? '男' : '女'}>
              性别
            </Item>
            <Item arrow extra={UserProfile.birthday}>
              生日
            </Item>
          </List>

          <DatePicker
            visible={false}
            value={new Date()}
            title='选择年月日'
            min={new Date(1900, 0, 1, 0, 0, 0)}
            max={new Date()}
          />
        </div>

        <div className='logout'>
          <Button className='btn' onClick={logoutFrom}>
            退出登录
          </Button>
        </div>
      </div>
      <Popup destroyOnClose visible={inputVisible} position='right'>
        <EditInput
          onUpdataName={onSave}
          value={UserProfile.name}
          onClose={onInputHide}
        ></EditInput>
      </Popup>
    </div>
  )
}

export default ProfileEdit
