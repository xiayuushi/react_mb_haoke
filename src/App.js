import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 首屏加载的路由不作懒加载处理
import Home from './pages/Home'

// 自定义封装的鉴权路由也不作懒加载处理
import XxxRoute from './components/XxxRoute'

// 其余非首屏加载的路由做懒加载处理
const CityList = lazy(() => import('./pages/CityList')) 
const Map = lazy(() => import('./pages/Map')) 
const Detail = lazy(() => import('./pages/HouseDetail')) 
const Login = lazy(() => import('./pages/Login')) 
const Rent = lazy(() => import('./pages/Rent')) 
const RentAdd = lazy(() => import('./pages/Rent/Add')) 
const RentSearch = lazy(() => import('./pages/Rent/Search')) 

const App = () => (
  <Router>
    <div className="App-container">
      <Suspense fallback={(<div className="suspense-load">加载中...</div>)}>
      {/* 一级路由出口 */}
        <Route path="/" exact render={ () => (<Redirect to="/home" />) } />
        <Route path="/home" component={ Home } />
        <Route path="/citylist" component={ CityList } />
        <Route path="/map" component={ Map } />
        <Route path="/detail/:id" component={ Detail } />
        <Route path="/login" component={ Login } />
        <XxxRoute path="/rent" exact component={ Rent } />
        <XxxRoute path="/rent/add" component={ RentAdd } />
        <XxxRoute path="/rent/search" component={ RentSearch } />
      </Suspense>
    </div>
  </Router>
)

export default App

// 1、当前项目采用react-router-dom@5.x版本，如果使用@6.x版本，则路由使用以及配置规则会与此有很大的区别
// 2、采用无状态组件函数组件来进行静态数据展示，使用有状态组件类组件来进行数据驱动视图更新
// 3、重定向必须配置在根组件App.js中
// 4、react-router-dom@5.x版本中使用Redirect组件来做重定向处理，它必须嵌套到BrowserRouter或者HashRouter组件内部与Route组件处于同一级
// 5、Redirect组件to属性用于指定重定向的目标路径，值是字符串形式的path路径
// 6、根组件或者父级组件进行重定向时必须使用精确匹配
// 7、react-router-dom@5.x版本中Route组件设置path对应组件的两种方式：component属性与render属性
// 7、A 使用component属性指定组件，即先创建组件并指定给component属性使用 例如：<Route path="/first" component={ First } /> 必须先创建或者导入First组件
// 7、B 使用render属性指定一个函数方法返回一个组件，即行内式返回组件 例如：<Route path="/first" render={ ()=>(<xxx></xxx>) } /> 直接行内创建使用组件

// 8、路由懒加载使用流程
// -、1 从react中导入Suspense与lazy  -->例如 import { Suspense, lazy } from 'react'
// -、2 将非首屏加载的组件改成懒加载的导入方式 --> 例如 const Xxx = lazy(()=>import('./xxx'))
// -、3 在App.js中一级路由Route组件的外部使用Suspense组件包裹 --> 例如 <Suspense><Route /></Suspense>
// -、4 可以给Suspense组件fallback设置组件渲染前的结构 --> 例如 <Suspense fallback={(<div className="suspense-load">加载中...</div>)}></Suspense>
// -、5 可以在src/index.css中设置.suspense-load加载中的相关样式 
// -、6 二级路由也使用上面懒加载lazy+import的方式导入，但是无需使用Suspense组件包裹Route路由配置规则
