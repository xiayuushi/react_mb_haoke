import { Component } from 'react'
import { Carousel, Flex } from 'antd-mobile'
import styles from './index.module.scss'

import navImg1 from '../../assets/navs/nav-1.png'
import navImg2 from '../../assets/navs/nav-2.png'
import navImg3 from '../../assets/navs/nav-3.png'
import navImg4 from '../../assets/navs/nav-4.png'

const NavDataList = [
  { id: 1, img: navImg1, title: '整租', path: '/home/list' },
  { id: 2, img: navImg2, title: '合租', path: '/home/index' },
  { id: 3, img: navImg3, title: '地图找房', path: '/home/map' },
  { id: 4, img: navImg4, title: '去出租', path: '/home/rent' },
]

class Index extends Component {
  state = {
    swipers: [],
    isSwipers: false
  }

  getSwipers = async () => {
    const { body } = await this.$request('/home/swiper')
    this.setState(() => ({ swipers: body, isSwipers: true }))
  }

  componentDidMount() {
    this.getSwipers()
  }

  renderCarousel = () => {
    return this.state.swipers.map(v => (
        <a key={v.id} href="" style={{ display: 'inline-block', width: '100%', height: 212 }}>
          <img src={process.env.REACT_APP_URL+v.imgSrc} alt="" style={{ width: '100%', verticalAlign: 'top' }} />
        </a>
    ))
  }

  renderNavs = () => {
    return NavDataList.map(v => (
      <Flex.Item key={v.id} onClick={ () => this.props.history.push(v.path) }>
        <img src={v.img} alt="" />
        <p>{v.title}</p>
      </Flex.Item>
    ))
  }
  render() {
    return (
      <div className={styles['home-index-container']}>
        <div className={styles['carousel-wrap']}>
          {
            this.state.isSwipers 
            ? <Carousel autoplay infinite>{ this.renderCarousel() }</Carousel>
            : ''
          }
        </div>
        <Flex>{ this.renderNavs() }</Flex>
      </div>
    );
  }
}

export default Index

// 1、Q：轮播图的自动轮播与浏览器的阻止默认事件冲突报错'Unable to preventDefault inside passive event ...'
// 1、A：在css样式中将所有标签样式设置为 touch-action: pan-y;
// 2、Q：antd-mobile（v2版本）的Carousel组件存在两个问题：轮播图不会自动加载、从其他路由返回时高度会丢失
// 2、A：造成Carousel以上两个的原因是：轮播图数据是动态加载的，一开始数据是空的，加载完成前后数量不一致导致的
// 2、S：在state中添加一个布尔值数据isSwipers，当轮播图加载完成时设置该布尔值为true，该值为true时再渲染组件
