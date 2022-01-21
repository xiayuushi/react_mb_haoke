import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import Detail from './pages/HouseDetail'
import Login from './pages/Login'
import XxxRoute from './components/XxxRoute'
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'

const App = () => (
  <Router>
    <div className="App-container">
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
