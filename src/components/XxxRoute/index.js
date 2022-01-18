import { isAuth } from '../../utils/auth'
import { Route, Redirect } from 'react-router-dom'

const XxxRoute = ({ component: Component, ...rest }) => {
  return <Route { ...rest } render={ props => {
    const isLogin = isAuth()
    return isLogin
      ? <Component { ...props } />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
  }} />
}

export default XxxRoute

// 1、当前封装的是鉴权路由，因为React没有直接提供类似Vue那样的导航守卫，如要实现鉴权路由必须自行封装
// 2、封装好后的使用方式：<XxxRoute path="路径" component={ 首字母大写的组件名 } />
// -、之前Route组件怎么使用，当前封装的也就怎么使用，只不过自行封装的加上了鉴权逻辑
// -、即，在配置路由规则时采用当前封装的XxxRoute组件替代之前的Route组件（需要鉴权则使用XxxRoute，常规的依旧使用Route组件配置路由）
// -、使用封装的组件时需要传递component（因为react组件名必须首字母大写，因此必须解构重命名）以及其余可能用到的其他参数如path等等（可以使用ES6语法剩余参数 ...rest）
// 3、此次封装本质上是对原生Route组件进行包装，为其添加一些功能，让其可以根据用户登录情况，访问不同的页面（即让原生Route组件拥有鉴权访问功能）
// -、即，通过render-props模式为react-router-dom的Route组件传递参数，让其自行根据情况逻辑来为Route提供不同的参数，从而跳转不同的页面
// -、Q1 用户已登录，直接跳转到传递的组件Component
// -、Q2 用户未登录，重定向到登录页，同时记录下因未登录而未能跳转的目标页面路由（后续当用户登录后可以再进行逻辑跳转）
// 4、自定义封装的XxxRoute组件的参数都必须交给react-router-dom的Route组件去使用
// 5、Route组件的render属性类似于component属性，render属性是通过行内的方式直接渲染内容，而component属性是通过导入组件的方式再渲染组件中的内容
// -、Route组件render属性中的props就是路由中的属性集合
// 6、Redirect组件的to属性指向目标路由的相关配置，pathname属性是目标路由路径，state属性用于配置路由附加的额外信息
// -、此处state.from的值props.location就是登录成功后要跳转的页面地址
// N1、render-props模式，即 为组件定义属性，属性值中通过回调的方式渲染返回JSX，是react组件复用状态的方式之一
