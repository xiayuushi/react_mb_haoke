import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'

import XxxNavHeader from '../../components/XxxNavHeader'

import styles from './index.module.scss'
import request from '../../utils/request'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    const { values: {username, password}, handleChange, handleSubmit } = this.props
    return (
      <div className={styles['root']}>
        {/* 顶部导航 */}
        <XxxNavHeader className={styles['navHeader']}>账号登录</XxxNavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form onSubmit={ handleSubmit }>
            <div className={styles['formItem']}>
              <input
                className={styles['input']}
                name="username"
                value={ username }
                onChange={ handleChange }
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles['formItem']}>
              <input
                className={styles['input']}
                name="password"
                type="password"
                value={ password }
                onChange={ handleChange }
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles['formSubmit']}>
              <button className={styles['submit']} type="submit">
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles['backHome']}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

Login = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }),
  handleSubmit: async (values, { props }) => {
    const res = await request('/user/login', 'post', values)
    console.log(res)
    if (res.status === 200) {
      Toast.info('登录成功', 1, null, false)
      localStorage.setItem('hkzf_token', res.body)
      props.history.go(-1)
    } else {
      Toast.info(res.description, 2, null, false)
    }
  },
  displayName: 'BasicForm'
})(Login)

export default Login

// 1、mapPropsToValues用于配置表单状态，在回调返回的对象中去声明与表单元素的value属性绑定的数据，相当于在state中声明数据与表单元素的value属性绑定
// -、总之，之前定义在状态组件state的表单数据，此时配置在mapPropsToValues返回的对象中，后续可以通过组件props拿到这些用于与表单元素value属性绑定的数据
// 2、handleSumbit用于表单事件提交，第一形参values就是mapPropsToValues中返回的用于表单元素的values的值的集合（对象）
// 3、displayName用于配置react调试工具的名称便于查看数据
// 4、handleSubmit中的this并非指向react组件实例，因此挂载到组件实例的$request无法使用，只能通过导入封装的axios实例request发送请求
// 5、handleSubmit中的this并非指向react组件实例，因此this也无法获取react组件中原本的props，因此必须通过第二形参对象formikBag，从对象中解构出props来获取react组件原本的props

// formik基本使用流程（formik是react专门用于表单处理的一个库，可以不通过原本繁琐的受控组件方式去处理表单逻辑，该库会搭配yup库进行表单验证） 
// 1、安装formik
// 2、选择一种formik使用方式（HOC或者render-props这两种方式都可以），解构出对应的使用方式，此处以使用HOC的方式（withFormik）为例
// 3、组件名 = withFormik(配置项对象)(react组件名)
// 4、HOC的配置对象中去配置mapPropsToValues、handleSumbit、displayName等
// 5、在组件内部通过props解构出配置好的HOC的相关属性（例如values、handleChange, handleSubmit等）与表单元素的相关属性进行绑定
// 5、values中的属性与表单value属性表单、handleChange与表单onChange属性绑定、handleSubmit与Form表单的onSubmit绑定

// N1、handleSubmit中第二参数formikBag对象就是react组件中原本的一些数据的集合，从中解构出props就可以去操作组件原本的props
// N2、handleChange指向不同的表单元素的前提是，这些表单元素设置了name属性，且name属性的值与表单的value值绑定的数据名称保持一致
