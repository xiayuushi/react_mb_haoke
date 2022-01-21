import { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank } from 'antd-mobile'
import styles from './index.module.scss'
import { getCurrentCity } from '../../utils/citydata'

import navImg1 from '../../assets/navs/nav-1.png'
import navImg2 from '../../assets/navs/nav-2.png'
import navImg3 from '../../assets/navs/nav-3.png'
import navImg4 from '../../assets/navs/nav-4.png'
import XxxSearchHeader from '../../components/XxxSearchHeader'

const navDataList = [
  { id: 1, img: navImg1, title: '整租', path: '/home/list' },
  { id: 2, img: navImg2, title: '合租', path: '/home/index' },
  { id: 3, img: navImg3, title: '地图找房', path: '/home/map' },
  { id: 4, img: navImg4, title: '去出租', path: '/rent/add' },
]

class Index extends Component {
  state = {
    swipers: [],
    groups: [],
    news: [],
    isSwipers: false,
    currentCityName: '深圳'
  }

  getSwipers = async () => {
    const { body } = await this.$request('/home/swiper')
    this.setState(() => ({ swipers: body, isSwipers: true }))
  }

  getGroups = async (area = 'AREA%7C88cff55c-aaa4-e2e0') => {
    const { body } = await this.$request('/home/groups','get',{ area })
    this.setState(() => ({ groups: body }))
  }

  getNews = async (area = 'AREA%7C88cff55c-aaa4-e2e0') => {
    const { body } = await this.$request('/home/news', 'get', { area })
    this.setState(() => ({ news: body }))
  }

  getCurrentCityName = async () => {
    const { label } = await getCurrentCity()
    this.setState(() => ({ currentCityName: label }))
  }

  componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getNews()
    this.getCurrentCityName()
  }

  renderCarousel = () => {
    return this.state.swipers.map(v => (
        <a key={v.id} href="" style={{ display: 'inline-block', width: '100%' }}>
          <img src={process.env.REACT_APP_URL+v.imgSrc} alt="" style={{ width: '100%', verticalAlign: 'top' }} />
        </a>
    ))
  }

  renderNavs = () => {
    return navDataList.map(v => (
      <Flex.Item key={ v.id } onClick={ () => this.props.history.push(v.path) }>
        <img src={ v.img } alt="" />
        <p>{ v.title }</p>
      </Flex.Item>
    ))
  }

  renderGroupContent = (item) => {
    return (
      <Flex>
        <Flex.Item className={ styles['group-item'] } key={ item.id }>
          <div className={ styles['content'] }>
            <h2 className={ styles['title'] }>{ item.title }</h2>
            <p className={ styles['desc'] }>{ item.desc }</p>
          </div>
          <img src={ process.env.REACT_APP_URL + item.imgSrc } alt="" />
        </Flex.Item>
      </Flex>
    )
  }

  renderNews = () => {
    return (
      this.state.news.map(v => (
        <Flex className={ styles['news-item'] } key={ v.id }>
          <img className={ styles['img'] } src={ process.env.REACT_APP_URL + v.imgSrc } alt="" />
          <Flex className={ styles['content'] } direction="column" justify="between" align="start">
            <p className={ styles['title'] }>{ v.title }</p>
            <Flex className={ styles['desc'] } justify="between">
              <span>{ v.from }</span>
              <span>{ v.date }</span>
            </Flex>
          </Flex>
        </Flex>
      ))
    )
  }

  render() {
    return (
      <div className={ styles['home-index-container'] }>

        {/* 轮播图 */}
        <div className={ styles['carousel-wrap'] }>
          {
            this.state.isSwipers 
            ? <Carousel autoplay infinite>{ this.renderCarousel() }</Carousel>
            : ''
          }
        {/* 顶部导航 */}
          <XxxSearchHeader currentCityName={ this.state.currentCityName } />
        </div>

        {/* 菜单导航 */}
        <Flex>{ this.renderNavs() }</Flex>

        {/* 租房小组 */}
        <div className={ styles['group-wrap'] }>
          <div className={ styles['theme'] }>
            <h2>租房小组</h2>
            <span>更多</span>
          </div>
          <Grid data={ this.state.groups } activeStyle columnNum={ 2 } hasLine={ false } square={ false } renderItem={ this.renderGroupContent } />
        </div>

        {/* 最新资讯 */}
        <div className={ styles['news-wrap'] }>
          <h2>最新资讯</h2>
          <WingBlank size='md'>{ this.renderNews() }</WingBlank>
        </div>

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
// 3、Q：点击导航菜单，导航到 /home/list 路由对应的HouseList组件时，下方tabbar并没有进行同步高亮显示
// 3、A：之前在Home组件中实现tabbar的逻辑时，只考虑到了第一次加载Home组件以及点击tabbar的情况，暂没考虑到不重新加载Home不点击tabbar但路由切换的情况
// 3、S：在Home组件中通过componentDidUpdate钩子函数去监听路由切换，重新更新state，让数据驱动视图更新
// 4、antd-mobile中的Grid组件renderItem属性的值是一个回调，用于渲染JSX结构，该回调第一个形参可以获取每一项用于渲染的数据，即renderItem={(item,index)=>{return JSX}}
// 5、某个元素上同时具备css-modules的类样式与通用样式，可以写成数组join()拼接的形式
// 5、例如 className={ [styles['xxx'], 'active'].join(' ') } 
// 5、此处 示例styles['xxx']是css-modules的样式，而'active'是通用样式（或者是css-modules使用:global()定义的全局通用类样式）
// 5、注意：css-modules的样式需要通过变量对象点出，常规类样式或者css-modules的全局类样式不需要通过变量对象点出
