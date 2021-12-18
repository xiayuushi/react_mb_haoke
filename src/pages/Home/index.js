import { Component } from 'react'
import { TabBar } from 'antd-mobile'
import { Route } from 'react-router-dom'

import './index.scss'
import News from '../News'
import Index from '../Index'
import Profile from '../Profile'
import HouseList from '../HouseList'

const tabDataList = [
  { title: '首页', icon: 'icon-ind', path: '/home/index' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' },
]

class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname
  }
  renderTabItem = () => {
    return tabDataList.map(v => (
      <TabBar.Item
      title={v.title}
      key={v.icon}
      icon={<i className={`iconfont ${v.icon}`} />}
      selectedIcon={<i className={`iconfont ${v.icon}`} />}
      selected={this.state.selectedTab === v.path}
      onPress={() => {
        this.setState({
          selectedTab: v.path,
        })
        this.props.history.push(v.path)
      }}
    >
    </TabBar.Item>
    ))
  }
  render () {
    console.log(this.props.location.pathname)
    return (
      <div className='home-container'>
        {/* 当前组件嵌套的子路由（用于展示tabbar对应的内容区） */}
        <Route path="/home/index" component={Index} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/news" component={News} />
        <Route path="/home/profile" component={Profile} />
        {/* tabbar */}
        <TabBar unselectedTintColor="#888" tintColor="#21b97a" noRenderContent={true}>
         {this.renderTabItem()}                       
        </TabBar>           
      </div>
    )
  }
}

export default Home

// 1、设置嵌套路由的path，格式以父路由path开头（父组件展示，子组件才能展示）
// 2、修改pathname为'/home/news'（浏览器直接输入该路径），News组件的内容才会展示在Home组件中，此时就形成了路由嵌套
// 3、antd-mobile的tabbar组件分为内容区与tab栏，设置noRenderContent={true}可以不渲染内容区，因为当前项目的内容区会使用路由控制
// 4、tabDataList是遍历渲染tabbar组件所需的数据（自己抽离差异化数据用于后续简化冗余代码）
// 5、renderTabItem是自定义的方法，用于重构简化冗余代码，会根据tabDataList数据返回列表项Tab.Item组件对应的JSX结构
