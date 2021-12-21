import { Component } from 'react'
import { NavBar } from 'antd-mobile'
import styles from './index.module.scss'

class CityList extends Component {
  render () {
    return (
      <div className={ styles['city-list-container'] }>
        <NavBar
          className={ styles['navbar'] }
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >城市选择</NavBar>
      </div>
    )
  }
}

export default CityList
