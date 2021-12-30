import { Component } from 'react'
import { Flex } from 'antd-mobile'
import XxxSearchHeader from '../../components/XxxSearchHeader'
import styles from './index.module.scss'

const { label } = JSON.parse(localStorage.getItem('hkzf_city'))

class HouseList extends Component {
  render () {
    return (
      <div className={ styles['house-list-container'] }>
        <Flex className={ styles['top-search'] }>
          <i className="iconfont icon-back" onClick={ () => this.props.history.go(-1) } />
          <XxxSearchHeader currentCityName={ label } className={ styles['xxx-search-header'] } />
        </Flex>
      </div>
    )
  }
}

export default HouseList

// 1、react控制通用组件样式的思路一般有两种
// -、Q1 直接在当前组件定义样式名来作用到通用组件，对通用组件中的样式进行改写或者覆盖
// -、Q2 传入属性的方式来改写通用组件的样式，例如此处对XxxSearchHeader组件传入className属性
// -、Q2 （如果是传入属性的方式改写样式，则必须在XxxSearchHeader组件内部props接收该属性并置于其原有样式之后，以便进行覆盖样式操作）
