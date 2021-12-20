import { Component } from 'react'
import { TabBar } from 'antd-mobile'
import { Route } from 'react-router-dom'

import styles from './index.module.scss'
import News from '../News'
import Index from '../Index'
import Profile from '../Profile'
import HouseList from '../HouseList'

const tabDataList = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/list' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' },
]

class Home extends Component {
  state = {
    selectedTab: this.props.location.pathname
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState(() => ({ selectedTab: this.props.location.pathname }))
    }
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
        }}>
      </TabBar.Item>
    ))
  }
  render () {
    return (
      <div className={styles['home-container']}>
        {/* 当前组件嵌套的子路由（用于展示tabbar对应的内容区） */}
        <Route path="/home" exact component={Index} />
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
// 6、默认路由必须设置exact属性进行精确匹配，因为模糊匹配时如果其他路由包含默认路由的路径，则会将默认路由对应的组件内容也一并展示出来
// 7、通过CSS Modules来解决可能存在的样式冲突问题
// 7、st1 创建 [name].module.css或者创建 [name].module.scss文件
// 7、st2 在该文件中书写样式，使用单个类名，不建议用预编译处理的嵌套语法，因为css modules生成的样式名称是全局惟一的，不需要通过嵌套来区分作用域
// 7、st3 将 xxx.module.css 文件导入到react组件中，通过自定义变量名styles接收
// 7、st4 在组件标签中className中使用，格式 <Xxx className={ styles.类名 } />
// 7、st5 对于全局通用样式的类名建议使用 :global( ) 包裹起来，格式 :global(.x){...}，使用时直接按照常规类名使用，不需要用styles对象点出
// 8、componentDidUpdate钩子函数可以监听类组件中props与state的变化，因此该钩子的作用类似于vue中的watch侦听器
// 8、componentDidUpdate钩子函数中去更新state状态，数据驱动视图更新时必须将更新代码写在判断语句中，否则会触发递归更新导致栈溢出
// 9、prevProps.location.pathname !== this.props.location.pathname 此时componentDidUpdate监听到了路由变化
// 10、同一标签中如果同时使用多个样式，可以使用如下方式进行书写
// 10、1 <Xxx className={ `iconfont ${ styles.xxx }` } />
// 10、2 <Xxx className={ ['iconfont', style.xxx].join(" ") } />
// 以上，前者'iconfont'是css modules中的使用:global()定义的全局通用样式，后者'styles.xxx'是css modules中定义的局部样式
