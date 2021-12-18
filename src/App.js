import { Button } from 'antd-mobile'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Home from './pages/Home'
import CityList from './pages/CityList'

const App = () => (
  <Router>
    <div>
      <h1>根组件</h1>
      <Button>测试</Button>
      {/* 路由入口 */}
      <Link to="/citylist">点击去往城市列表组件</Link>
      {/* 路由出口 */}
      <Route path="/home" component={Home}></Route>
      <Route path="/citylist" component={CityList}></Route>
    </div>
  </Router>
)

export default App

// 1、当前项目采用react-router-dom@5.x版本，如果使用@6.x版本，则路由使用以及配置规则会与此有很大的区别
// 2、采用无状态组件函数组件来进行静态数据展示，使用有状态组件类组件来进行数据驱动视图更新
