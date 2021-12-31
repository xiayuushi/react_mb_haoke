import { NavBar } from 'antd-mobile'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

const XxxNavHeader = (props) => {
  const onDefaultBehavior = () => props.history.go(-1)
  return (
    <NavBar
      className={ styles['navbar'] }
      mode="light"
      icon={ <i className="iconfont icon-back" /> }
      onLeftClick={ props.onLeftClick || onDefaultBehavior } >
      { props.children }
    </NavBar>
  )
}

XxxNavHeader.propTypes = {
  onLeftClick: PropTypes.func,
  children: PropTypes.string.isRequired
}

export default withRouter(XxxNavHeader)

// 1、当前组件是自定义封装的全局通用顶部导航栏组件（基于antd-mobile的NavBar组件封装）
// 2、props用于接收外界使用者传递的数据进行内容展示或者功能的使用（此处props之所以不采取ES6对象解构写法，是为了便于直观查看数据）
// -、1 props.children用于接收使用者传递的文本节点作为当前导航栏的标题
// -、2 props.onLeftClick用于接收使用者定义的左侧点击事件（如果不传该属性，则默认行为是点击返回上一页）
// 3、withRouter是react-router-dom提供的HOC，用于为未直接配置路由的组件增加'路由'功能
// 4、没有使用react-router-dom配置路由却要使用路由参数或者功能，则必须借助于withRouter来实现
// 5、使用withRouter将不能使用路由参数或者路由跳转的源组件包裹一层，返回一个新的具有配置路由功能的新组件（让源组件可使用路由参数或路由跳转）
// 6、react中的HOC就是一个函数，本质是使用装饰器模式将某些功能加给之前不具备该功能的组件（从而达到增强组件功能或者复用组件的目的）
// 7、在react项目中封装组件时建议使用 prop-types 对组件的数据进行类型检查，提示使用者传入符合要求的数据格式
// -、prop-types导入时变量名称可以随意，但是组件点出的那个属性必须是小写字母开头的propTypes，这个属性是固定写法
