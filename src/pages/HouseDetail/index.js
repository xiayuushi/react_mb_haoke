import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'
import { isAuth } from '../../utils/auth'

import XxxNavHeader from '../../components/XxxNavHeader'
import XxxHouseItem from '../../components/XxxHouseItem'
import XxxHousePackage from '../../components/XxxHousePackage'

import styles from './index.module.scss'

const alert = Modal.alert

// 猜你喜欢
const recommendHouses = [
  {
    id: 1,
    src: process.env.REACT_APP_URL + '/img/message/1.png',
    desc: '72.32㎡/南 北/低楼层',
    title: '安贞西里 3室1厅',
    price: 4500,
    tags: ['随时看房']
  },
  {
    id: 2,
    src: process.env.REACT_APP_URL + '/img/message/2.png',
    desc: '83㎡/南/高楼层',
    title: '天居园 2室1厅',
    price: 7200,
    tags: ['近地铁']
  },
  {
    id: 3,
    src: process.env.REACT_APP_URL + '/img/message/3.png',
    desc: '52㎡/西南/低楼层',
    title: '角门甲4号院 1室1厅',
    price: 4300,
    tags: ['集中供暖']
  }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
  position: 'absolute',
  zIndex: -7982820,
  backgroundColor: 'rgb(238, 93, 91)',
  color: 'rgb(255, 255, 255)',
  height: 25,
  padding: '5px 10px',
  lineHeight: '14px',
  borderRadius: 3,
  boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
  whiteSpace: 'nowrap',
  fontSize: 12,
  userSelect: 'none'
}

class HouseDetail extends Component {
  state = {
    isLoading: false,
    isFavorite: false,
    houseInfo: {
      // 房屋图片
      houseImg: [],
      // 标题
      title: '',
      // 标签
      tags: [],
      // 租金
      price: 0,
      // 房型
      roomType: '两室一厅',
      // 房屋面积
      size: 89,
      // 装修类型
      renovation: '精装',
      // 朝向
      oriented: [],
      // 楼层
      floor: '',
      // 小区名称
      community: '',
      // 地理位置
      coord: {
        latitude: '39.928033',
        longitude: '116.529466'
      },
      // 房屋配套
      supporting: [],
      // 房屋标识
      houseCode: '',
      // 房屋描述
      description: ''
    }
  }

  getHouseInfo = async () => {
    this.setState({isLoading: true })
    const { id } = this.props.match.params
    const { body } = await this.$request(`/houses/${id}`)
    this.setState({ houseInfo: body, isLoading: false })
    const { community, coord } = body
    this.renderMap(community, coord)
  }

  checkFavorite = async () => {
    const isLogin = isAuth()
    if (!isLogin) return
    const { id } = this.props.match.params
    const { status, body } = await this.$request(`/user/favorites/${id}`)
    if (status === 200) this.setState({ isFavorite: body.isFavorite })
  }

  handlerFavorite = async () => {
    const isLogin = isAuth()
    if (!isLogin) {
      return alert('请登录后再操作', '是否现在跳转到登录页?', [
        { text: '取消' },
        { text: '确定', onPress: () => this.props.history.push('/login', { from: this.props.location }) }
      ])
    }
    const { id } = this.props.match.params
    if (this.state.isFavorite) {
      this.setState({ isFavorite: false })
      const res = await this.$request(`/user/favorites/${id}`, 'delete')
      if (res.status === 200) {
        Toast.info('已取消收藏', 1, null, false)
      } else {
        Toast.info('登录超时，请重新登录', 1, null, false)
      }
    } else {
      const res = await this.$request(`/user/favorites/${id}`, 'post')
      if (res.status === 200) {
        this.setState({ isFavorite: true })
        Toast.info('收藏成功', 1, null, false)
      } else {
        Toast.info('登录超时，请重新登录', 1, null, false)
      }
    }
  }

  componentDidMount () {
    this.getHouseInfo()
    this.checkFavorite()
  }

  // 渲染轮播图结构
  renderSwipers() {
    const { houseImg } = this.state.houseInfo
    return houseImg.map(item => (
      <a
        key={item}
        href="http://itcast.cn"
        style={{
          display: 'inline-block',
          width: '100%',
          height: 252
        }}
      >
        <img
          src={process.env.REACT_APP_URL + item}
          alt=""
          style={{ width: '100%',height: '100%', verticalAlign: 'top' }}
        />
      </a>
    ))
  }

  // 渲染地图
  renderMap(community, coord) {
    const { latitude, longitude } = coord

    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label('', {
      position: point,
      offset: new BMap.Size(0, -36)
    })

    label.setStyle(labelStyle)
    label.setContent(`
      <span>${community}</span>
      <div class="${styles.mapArrow}"></div>
    `)
    map.addOverlay(label)
  }

  // 渲染tag标签
  renderTags() {
    const { tags } = this.state.houseInfo
    let className = ''
    return (
      tags.map((v, i) => {
        (i > 5) 
        ? className = 'tag3'
        : className = `tag${i+1}`
        return (
          <span className={[styles.tag, styles[className]].join(' ')} key={v}>
            { v }
          </span>
        )
      })
    )
  }

  render() {
    const {
      isLoading, 
      isFavorite,
      houseInfo: { community, title, price, roomType, size, floor, oriented, description, supporting },
    } = this.state
    return (
      <div className={styles.root}>
        {/* 导航栏 */}
        <XxxNavHeader
          className={styles.navHeader}
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          { community }
        </XxxNavHeader>

        {/* 轮播图 */}
        <div className={styles.slides}>
          {!isLoading ? (
            <Carousel autoplay infinite autoplayInterval={5000}>
              {this.renderSwipers()}
            </Carousel>
          ) : (
            ''
          )}
        </div>

        {/* 房屋基础信息 */}
        <div className={styles.info}>
          <h3 className={styles.infoTitle}>
            { title }
          </h3>
          <Flex className={styles.tags}>
            <Flex.Item>
             {
               this.renderTags()
             }
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoPrice}>
            <Flex.Item className={styles.infoPriceItem}>
              <div>
                { price }
                <span className={styles.month}>/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
            <div>{ roomType }</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className={styles.infoPriceItem}>
              <div>{ size }平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className={styles.infoBasic} align="start">
            <Flex.Item>
              <div>
                <span className={styles.title}>装修：</span>
                精装
              </div>
              <div>
                <span className={styles.title}>楼层：</span>
                { floor }
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className={styles.title}>朝向：</span>{ oriented.join('、') }
              </div>
              <div>
                <span className={styles.title}>类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>

        {/* 地图位置 */}
        <div className={styles.map}>
          <div className={styles.mapTitle}>
            小区：
            <span>{ community }</span>
          </div>
          <div className={styles.mapContainer} id="map">
            地图
          </div>
        </div>

        {/* 房屋配套 */}
        <div className={styles.about}>
          <div className={styles.houseTitle}>房屋配套</div>
         {
           supporting.length === 0 
           ? (<div className="title-empty">暂无数据</div>) 
           : (<XxxHousePackage list={ supporting } />)
         }
        </div>

        {/* 房屋概况 */}
        <div className={styles.set}>
          <div className={styles.houseTitle}>房源概况</div>
          <div>
            <div className={styles.contact}>
              <div className={styles.user}>
                <img src={process.env.REACT_APP_URL + '/img/avatar.png'} alt="头像" />
                <div className={styles.useInfo}>
                  <div>王女士</div>
                  <div className={styles.userAuth}>
                    <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                </div>
              </div>
              <span className={styles.userMsg}>发消息</span>
            </div>

            <div className={styles.descText}>
              {description || '暂无房屋描述'}
            </div>
          </div>
        </div>

        {/* 推荐 */}
        <div className={styles.recommend}>
          <div className={styles.houseTitle}>猜你喜欢</div>
          <div className={styles.items}>
            {recommendHouses.map(item => (
              <XxxHouseItem {...item} key={item.id} />
            ))}
          </div>
        </div>

        {/* 底部收藏按钮 */}
        <Flex className={styles.fixedBottom}>
          <Flex.Item onClick={ this.handlerFavorite }>
            <img
              src={process.env.REACT_APP_URL +  (isFavorite ? '/img/star.png' : '/img/unstar.png')}
              className={styles.favoriteImg}
              alt="收藏"
            />
            <span className={styles.favorite}>{ isFavorite ? '已收藏' : '收藏' }</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className={styles.telephone}>
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}

export default HouseDetail

// 1、renderTags()当标签超过预定义的样式类时，后续以某个类样式为准
// 2、checkFavorite 检查登录用户是否已收藏当前房源
// -、用户未登录不发请求检查当前房源收藏情况，用户已登录则发请求检查当前房源收藏情况
// -、isFavorite用户是否收藏当前房源，后续会根据该布尔值来显示底部收藏按钮不同的图片及文本
// 3、props.history.push()第二参数是可选的状态
// -、这个第二参数与自定义封装鉴权路由组件XxxRoute组件时其中Redirect组件的to属性的state对象中的键(from)保持一致即可
// 4、handlerFavorite 用户未登录点击收藏时提醒其登录，登录后重定向回当前页
// -、根据isFavorite的值来调用接口做不同的逻辑
// -、Q1 值为true 则调用删除收藏接口，取消收藏
// -、Q2 值为false 则调用添加收藏接口，添加收藏