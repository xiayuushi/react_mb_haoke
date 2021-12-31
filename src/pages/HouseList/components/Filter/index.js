import { Component } from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'

class Filter extends Component {
  render () {
    return (
      <div className={ styles['filter-container'] }>

        {/* 前三个菜单的遮罩层 */}
        {/* <div className={ styles['mask'] }></div> */}

        <div className={ styles['content'] }>
          {/* 标题栏 */}
          <FilterTitle />
          {/* 前三个筛选 */}
          <FilterPicker />
          {/* 后一个选项 */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}

export default Filter