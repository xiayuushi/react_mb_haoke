import { Component, createRef } from 'react'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

class XxxSticky extends Component {
  placeholder = createRef()
  content = createRef()

  scrollHandler = () => {
    const placeholderElement = this.placeholder.current
    const contentElement = this.content.current
    const { top } = placeholderElement.getBoundingClientRect()
    if (top < 0) {
      contentElement.classList.add(styles['fixed'])
      placeholderElement.style.height = `${this.props.height}rem`
    } else {
      contentElement.classList.remove(styles['fixed'])
      placeholderElement.style.height = '0rem'
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollHandler)
  }
  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  render () {
    return (
      <div>
        {/* 占位盒子 */}
        <div ref={ this.placeholder }></div>
        {/* 内容盒子 */}
        <div ref={ this.content }>{ this.props.children }</div>
      </div>
    )
  }
}

XxxSticky.propTypes = {
  height: PropTypes.number.isRequired
}

export default XxxSticky

// 1、使用当前封装的XxxSticky组件去包裹需要做吸顶效果的组件，即做吸顶效果的组件以props.children的形式传递进来
// 2、DOM.getBoundingClientRect()可以获取DOM元素位置坐标、宽高等信息，从中解构出top可以用于判断元素是否在可视区内
// 3、在componmentDidMount周期中添加事件监听，在componentWillUnmount周期中解除事件监听
// 4、DOM.classList.add(styles['fixed']) 表示为DOM元素的样式类列表中新增一个样式类，此处styles['fixed']是css-modules的类名
// 5、考虑到需要使用吸顶的组件可能高度不同，因此需要将吸顶高度提取为props属性，外界使用当前吸顶组件时根据包裹着的元素的实际情况传入的高度（此处使用rem单位）
// -、假设Axx组件需要做吸顶效果，而Axx的高度为2rem，则 <XxxSticky height={ 2 }> <Axx></Axx> </XxxSticky> 
// -、假设Bxx组件需要做吸顶效果，而Bxx的高度为4rem，则 <XxxSticky height={ 4 }> <Axx></Axx> </XxxSticky>
// -、封装的原则就是对变化点进行封装，变化点作为props动态设置
// 6、实现筛选栏吸顶功能流程
// -、st1 在当前XxxSticky组件内创建两个ref对象（placeholder、content）分别指向占位元素与内容元素
// -、st2 在componmentDidMount周期监听浏览器scroll事件，在componentWillUnmount周期中解除事件监听
// -、st3 在scroll事件中，调用DOM元素的getBoundingClientRect()得到占位元素的top（即元素最上边的位置）
// -、st4 在scroll事件中，判断top是否小于0（即判断占位元素是否在可视区内）
// -、st4 Q1 小于0（占位元素在可视区内），则为内容元素添加预先定义好的用于吸顶效果的'fixed'类，同时设置占位元素高度（设置成与条件筛选栏高度相同）
// -、st4 Q2 不小于0（占位元素不在可视区内），则为内容元素移除吸顶效果的'fixed'类，同时设置占位元素高度为0
// -、st5 后续如果某个组件需要添加吸顶效果，则只需要将其以props.children的方式包裹在XxxSticky组件内部即可
