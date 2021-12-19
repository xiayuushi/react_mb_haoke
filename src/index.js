import { Component } from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import './assets/fonts/iconfont.css'
import 'antd-mobile/dist/antd-mobile.css'
import './index.scss'
import request from './utils/request'

Component.prototype.$request = request

ReactDOM.render(<App />, document.querySelector('#root'))

// 1、全局样式必须放置在antd-mobile.css之后，才能覆盖掉antd-mobile.css的样式
