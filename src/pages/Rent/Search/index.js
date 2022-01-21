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
      <li key={item.community} className={styles.tip}>
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
// 2、
