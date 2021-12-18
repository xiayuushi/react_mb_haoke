import { Component } from 'react'
import { Route } from 'react-router-dom'
import './index.css'
import News from '../News'

class Home extends Component {
  render () {
    return (
      <div className='home-container'>
        首页组件
        <Route path="/home/news" component={News} />
      </div>
    )
  }
}

export default Home

// 1、设置嵌套路由的path，格式以父路由path开头（父组件展示，子组件才能展示）
// 2、修改pathname为'/home/news'（浏览器直接输入该路径），News组件的内容才会展示在Home组件中，此时就形成了路由嵌套
