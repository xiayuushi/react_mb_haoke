import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'

import XxxNavHeader from '../../components/XxxNavHeader'

import styles from './index.module.scss'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  state = {
    username: '',
    password: ''
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }
  onSubmit = async (e) => {
    e.preventDefault()
    const { username, password } = this.state
    const res = await this.$request('/user/login', 'post', { username, password })
    if (res.status === 200) {
      Toast.info('登录成功', 1, null, false)
      localStorage.setItem('hkzf_token', res.body)
      this.props.history.go(-1)
    }else {
      Toast.info(res.description, 2, null, false)
    }
  }

  render() {
    const { username, password } = this.state
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <XxxNavHeader className={styles.navHeader}>账号登录</XxxNavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={ this.onSubmit }>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="username"
                value={ username }
                onChange={ this.onChange }
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                name="password"
                type="password"
                value={ password }
                onChange={ this.onChange }
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button className={styles.submit} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

export default Login
