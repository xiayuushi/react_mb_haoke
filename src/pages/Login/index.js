import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import XxxNavHeader from '../../components/XxxNavHeader'

import styles from './index.module.scss'
import request from '../../utils/request'

// 验证规则：
// 长度为5到xxx位，只能出现数字、字母、下划线
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    return (
      <div className={styles['root']}>
        {/* 顶部导航 */}
        <XxxNavHeader className={styles['navHeader']}>账号登录</XxxNavHeader>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className={styles['formItem']}>
              <Field className={styles['input']} name="username" placeholder="请输入账号" />
            </div>
            {/* 此处使用ErrorMessage组件来替代之前的JSX中的逻辑判断，此处保留注释就是为了进行对比 */}
            {/* { errors.username && touched.username && (<div className={styles['error']}>{ errors.username }</div>) } */}
            <ErrorMessage className={styles['error']} component="div" name="username" />
            <div className={styles['formItem']}>
              <Field className={styles['input']} name="password" type="password" placeholder="请输入密码" />
            </div>
            {/* 验证格式出错提示：长度为5到12位，只能出现数字、字母、下划线 */}
            <ErrorMessage className={styles['error']} component="div" name="password" />
            <div className={styles['formSubmit']}>
              <button className={styles['submit']} type="submit">登 录</button>
            </div>
          </Form>
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
    if (res.status === 200) {
      Toast.info('登录成功', 1, null, false)
      localStorage.setItem('hkzf_token', res.body)
      !props.location.state
        ? props.history.go(-1)
        : props.history.replace(props.location.state.from.pathname)
    } else {
      Toast.info(res.description, 2, null, false)
    }
  },
  validationSchema: Yup.object().shape({
    username: Yup.string().required('账号为必填项').matches(REG_UNAME, '长度为5-8位，只能出现数字、字母、下划线'),
    password: Yup.string().required('密码为必填项').matches(REG_PWD, '请输入密码，长度在12位以内')
  }),
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
// 4、HOC的配置对象中去配置mapPropsToValues、handleSumbit、displayName、validate、validationSchema等
// 5、在组件内部通过props解构出配置好的HOC的相关属性（例如values、handleChange, handleSubmit等）与表单元素的相关属性进行绑定
// 5、values中的属性与表单value属性表单、handleChange与表单onChange属性绑定、handleSubmit与Form表单的onSubmit绑定
// 6、在validationSchema配置表单验证规则，可以使用yup这个库进行表单验证

// formik组件的使用
// 1、使用解构出Form组件替换原本的form标签，使用withFormik时原本的form标签上需要设置的handleSubmit与handleReset就可以省略了（formik的Form组件会自动添加）
// 2、使用解构出Field组件替换原本的表单元素标签，使用withFormik时原本的input标签上需要设置的value、onBlur与onChange等就可以省略了（formik的Field组件会自动添加）
// -、对于非input表单（例如 select 则可以为Field设置as属性指向select标签）
// 3、使用解构出的ErrorMessage组件替换掉JSX中判断提示验证出错的逻辑，且使用component属性指向原先的标签名，name属性指向原先的errors或者touched的验证字段
// -、之前：{ errors.username && touched.username && (<div className={styles['error']}>{ errors.username }</div>) }
// -、此时：<ErrorMessage className={styles['error']} component="div" name="username" />
// -、之前显示错误提示的标签的样式，直接设置给ErrorMessage组件即可
// -、因此之前为表单元素设置的handleBlur, errors, touched等属性也可以不用设置了
// 4、移除掉withFormik中解构出props的操作（但是withFormik的配置还是必须保留）
// 5、使用formik提供的组件来设置表单及表单元素只是简化标签中的属性设置而已，但是withFormik的配置还是必须保留的

// 1、在App.js中使用自定义封装的鉴权路由组件配置路由，例如： <XxxRoute path="/xxx" component={Xxx} />
// -、可以通过props.location.state是否有值来判断是未登录导致重定向到登录页的，还是直接从登录页进行登录的
// -、Q1 在登录成功的逻辑中，如果props.location.state.from没有数据，说明是直接从个人中心的登录按钮进行登录的，此时登录成功后可以返回到之前的个人中心页props.history.go(-1)
// -、Q2 在登录成功的逻辑中，如果props.location.state.from有数据，说明是未登录被鉴权路由拦下导致的重定向到登录页，此时登录成功后应该返回到props.location.state.from指定的目标页
// 2、props.history.push()与props.history.replace() 跳转路由的区别
// -、以使用鉴权路由从Home页跳转到Map页为例，props.history.push()是先从Home页面被鉴权路由重定向到Login登录页，登录后再跳到Map页（返回时，则从Map到Login再到Home）
// -、以使用鉴权路由从Home页跳转到Map页为例，props.history.replace()是从Home页面被鉴权路由重定向到Login登录页，登录后再跳到Map页（返回时，则从Map直接到Home，不会再经过Login）
// -、即 props.history.push() 进栈与出栈都是逐级操作，例如：登录Home->Login->Map 与  返回Map->Login->Home
// -、即 props.history.replace() 出栈时是替换操作，将Login替换成Home ，例如：登录Home->Login->Map 与  返回Map->Home（此时Home替换掉了Login，返回时不再经过Login）

// N1、handleSubmit中第二参数formikBag对象就是react组件中原本的一些数据的集合，从中解构出props就可以去操作组件原本的props
// N2、handleChange指向不同的表单元素的前提是，这些表单元素设置了name属性，且name属性的值与表单的value值绑定的数据名称保持一致
// N3、touched需要在表单元素上添加onBlur属性绑定handleBlur事件才会生效，用于表示该表单元素是否访问过（访问过再触发才是合理的）
// N4、errors是用于表单验证不通过时的提示信息，当某个表单元素验证不通过时，才让表单提示验证错误提示出现
// N5、validate可以手动表单校验，而validationSchema可以使用yup库进行表单校验
// N6、推荐使用formik + yup处理react与表单验证，使用yup验证时，withFormik配置项应该使用validationSchema
