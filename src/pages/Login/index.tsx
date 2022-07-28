import { Button, NavBar, Form, Input, Toast } from 'antd-mobile'
import { login } from '@/store/actions/login'
import { LoginForm } from '@/types/data'
import { useDispatch } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import { AxiosError } from 'axios'
import { useState, useRef, useEffect } from 'react'
import { InputRef } from 'antd-mobile/es/components/input'
import { sendCode } from '@/store/actions/login'
const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [form] = Form.useForm() // 直接使用useForm得到一个form实例对象
  const mobileRef = useRef<InputRef>(null) //如果不给泛型，传入的就是一个undifine
  const timeRef = useRef(-1) //用ref的current来记录计时器
  const location = useLocation<{ from: string } | undefined>() // 获取当前路由信息
  const [timeLeft, setTimeLeft] = useState(0)
  const onFinish = async (values: LoginForm) => {
    // login()
    try {
      await dispatch(login(values)) // 触发登录的action  thunk
      // 此时表示分发action成功 登录成功
      // 跳转到主页
      Toast.show({
        content: '登录成功',
        duration: 500,
        afterClose: () => {
          if (location.state) {
            history.replace(location.state.from)
            return
          }
          history.replace('/home/index') // 调到主页
        },
      })
    } catch (error) {
      const e = error as AxiosError<{ message: string }>
      Toast.show({
        content: e.response?.data.message,
      })
    }
  }
  //发送验证码
  const onSendCode = async () => {
    const mobile = (form.getFieldValue('mobile') || '') as string
    const isError = !!form.getFieldError('mobile').length as boolean
    //手机号码不正确
    if (isError || mobile.trim() === '') {
      mobileRef.current?.focus()
      return
    }
    try {
      //真确
      //发送验证码
      await dispatch(sendCode(mobile))
      Toast.show({
        content: '验证码已发送',
      })
      setTimeLeft(60)
      timeRef.current = window.setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } catch (error) {
      const e = error as AxiosError<{ message: string }>
      Toast.show({
        content: e.response?.data?.message,
      })
    }
  }
  useEffect(() => {
    if (timeLeft === 0) {
      window.clearInterval(timeRef.current)
    }
  }, [timeLeft])
  useEffect(() => {
    //只有空数组的情况 return会在卸载时执行
    return () => {
      window.clearInterval(timeRef.current)
    }
  }, [])
  return (
    <div className={styles.root}>
      <NavBar></NavBar>

      <div className='login-form'>
        <h2 className='title'>账号登录</h2>

        {/* <Form onFinish={onFinish}> */}
        <Form form={form} onFinish={onFinish}>
          {/* 1.手机号必填 2.校验手机号格式 */}
          <Form.Item
            name='mobile'
            validateTrigger='onBlur'
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '手机号格式错误' },
            ]}
            className='login-item'
          >
            <Input ref={mobileRef} placeholder='请输入手机号' />
          </Form.Item>
          {/* 1.验证码必填 2.校验验证码格式 */}
          <Form.Item
            name='code'
            validateTrigger='onBlur'
            rules={[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码格式不正确' },
            ]}
            className='login-item'
            extra={
              <span
                className='code-extra'
                onClick={timeLeft === 0 ? onSendCode : undefined}
              >
                {timeLeft === 0 ? '发送验证码' : `${timeLeft}后发送`}
              </span>
            }
          >
            <Input placeholder='请输入验证码' autoComplete='off' />
          </Form.Item>

          {/* noStyle 表示不提供 Form.Item 自带的样式 */}
          {/* shouldUpdate表示其他任意表单的更新 都会导致该form-item内容的重新渲染  */}
          <Form.Item noStyle shouldUpdate>
            {/* disabled应该是动态变量  根据当前的表单校验结果以及用户是否输入过 */}
            {() => {
              // 得到当前是否需要将按钮禁用
              // 1.校验没有通过 2.用户没有触摸过 检测errors的长度是否为0
              // 没有输入的时候 errors也为空数组 或者 用户从来没有输入过
              const disabed =
                form.getFieldsError().filter((item) => item.errors.length > 0)
                  .length > 0 || !form.isFieldsTouched(true)
              // console.log(form.getFieldsError())
              return (
                <Button
                  block
                  type='submit'
                  color='primary'
                  className='login-submit'
                  disabled={disabed}
                >
                  登 录
                </Button>
              )
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
