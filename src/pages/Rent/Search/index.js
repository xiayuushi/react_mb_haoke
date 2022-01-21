import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import { getCity } from '../../../utils/city'

import styles from './index.module.scss'

export default class Search extends Component {
  // 当前城市id
  cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className={styles.tip} onClick={ () => this.onTipsClick(item) }>
        {item.communityName}
      </li>
    ))
  }

  timeID = null
  onChange = value => {
    this.setState({ searchTxt: value })
    if (!value) return this.setState({ tipsList: [] })
    clearTimeout(this.timeID)
    this.timeID = setTimeout(async () => {
      const { body } = await this.$request(`/area/community`,'get', {
        name: value,
        id: this.cityId
      })
      this.setState({ tipsList: body })
    }, 500)
  }

  onTipsClick = (clickItem) => {
    this.props.history.replace('/rent/add', { name: clickItem.communityName, id: clickItem.community })
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={ this.onChange }
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}

// 1、onChange中之所以使用形参value作为判断依据，是因为this.setState()是异步的，如果用searchTxt作为判断依据是不及时的
// 2、this.props.history.replace() 是react-router-dom v5版本提供的一个API，
// -、该方法用于替换跳转页面栈，区别于history.push()的是，replace()是替换栈操作
// -、即A经过B跳转到页面C，从C返回A页面时，replace()是替换页面栈操作不会再经过B
// -、history.replace()第二参数是一个可选对象，可以为路由附加额外的信息数据，这些携带的数据在接收页可以通过props.location.state获取到
