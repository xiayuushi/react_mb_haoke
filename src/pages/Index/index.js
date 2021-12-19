import { Component } from 'react'
import { Carousel } from 'antd-mobile'
import styles from './index.module.scss'

class Index extends Component {
  state = {
    swipers: []
  }

  getSwipers = async () => {
    const { body } = await this.$request('/home/swiper')
    this.setState(() => ({ swipers: body }))
  }

  componentDidMount() {
    this.getSwipers()
  }

  renderCarouse = () => {
    return this.state.swipers.map(v => (
        <a key={v.id} href="" style={{ display: 'inline-block', width: '100%', height: 212 }}>
          <img src={process.env.REACT_APP_URL+v.imgSrc} alt="" style={{ width: '100%', verticalAlign: 'top' }} />
        </a>
    ))
  }
  render() {
    return (
      <div className={styles['home-index-container']}>
        <Carousel className='carouse-wrap'  autoplay infinite>
          { this.renderCarouse() }
        </Carousel>
      </div>
    );
  }
}

export default Index

// 1、轮播图的自动轮播与浏览器的阻止默认事件冲突，报错'Unable to preventDefault inside passive event ...'
// 1、在css样式中将所有标签样式设置为 touch-action: pan-y;
