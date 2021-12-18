import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import 'antd-mobile/dist/antd-mobile.css'
import './index.css'

ReactDOM.render(<App />, document.querySelector('#root'))

// 1、全局样式必须放置在antd-mobile.css之后，才能覆盖掉antd-mobile.css的样式
