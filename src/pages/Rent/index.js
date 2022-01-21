import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import XxxNavHeader from '../../components/XxxNavHeader'
import XxxHouseItem from '../../components/XxxHouseItem'
import XxxNoHouse from '../../components/XxxNoHouse'

import styles from './index.module.scss'

export default class Rent extends Component {
  state = {
    // 出租房屋列表
    list: []
  }

  // 获取已发布房源的列表数据
  async getHouseList() {
    const res = await this.$request('/user/houses')
    const { status, body } = res
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      const { history, location } = this.props
      history.replace('/login', {
        from: location
      })
    }
  }

  componentDidMount() {
    this.getHouseList()
  }

  renderHouseItem() {
    const { list } = this.state
    const { history } = this.props

    return list.map(item => {
      return (
        <XxxHouseItem
          key={item.houseCode}
          onClick={() => history.push(`/detail/${item.houseCode}`)}
          src={process.env.REACT_APP_URL + item.houseImg}
          title={item.title}
          desc={item.desc}
          tags={item.tags}
          price={item.price}
        />
      )
    })
  }

  renderRentList() {
    const { list } = this.state
    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <XxxNoHouse>
          您还没有房源，
          <Link to="/rent/add" className={styles.link}>
            去发布房源
          </Link>
          吧~
        </XxxNoHouse>
      )
    }

    return <div className={styles.houses}>{this.renderHouseItem()}</div>
  }

  render() {
    const { history } = this.props

    return (
      <div className={styles.root}>
        <XxxNavHeader onLeftClick={() => history.go(-1)}>房屋管理</XxxNavHeader>

        {this.renderRentList()}
      </div>
    )
  }
}
