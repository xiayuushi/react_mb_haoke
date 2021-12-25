import { Component } from 'react'
import ReactDOM from 'react-dom'

import './assets/fonts/iconfont.css'
import 'antd-mobile/dist/antd-mobile.css'
import 'react-virtualized/styles.css'
import './index.scss'

import App from './App'
import request from './utils/request'
import './utils/root'

Component.prototype.$request = request

ReactDOM.render(<App />, document.querySelector('#root'))

// 1、全局样式必须放置在antd-mobile.css之后，才能覆盖掉antd-mobile.css的样式
// 2、App组件是除了入口文件之外的项目顶级组件，一级路由配置也在App组件中完成，因此路由对应的页面级组件的样式覆盖问题也会被App组件的导入顺序影响
// 3、挂载到App下的路由所对应的页面级组件的样式，如果想要覆盖入口文件中的其他样式，则必须将App组件放置到所有样式文件的最后面，尤其是在封装通用组件时样式覆盖问题会特别明显
// 4、总之，入口文件中将App组件的导入放在样式导入的后面，可以避免样式覆盖的问题（这样子在封装通用组件时，调整样式会比较方便）
