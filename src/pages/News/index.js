import { Component } from 'react'
import styles from './index.module.scss'

class News extends Component {
  render () {
    return (
      <div className={ styles['news-container'] }>
        News组件的内容，它是二级路由组件
      </div>
    )
  }
}

export default News
