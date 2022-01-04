import { Component } from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

class Filter extends Component {
  state = {
    titleSelectedStatus
  }
  filterTitleClick = (clickItem) => {
    this.setState((state) => {
      return {
        titleSelectedStatus: {
          ...state.titleSelectedStatus,
          [clickItem]: true
        }
      }
    })
  }
  render () {
    return (
      <div className={ styles['filter-container'] }>

        {/* 前三个菜单的遮罩层 */}
        {/* <div className={ styles['mask'] }></div> */}

        <div className={ styles['content'] }>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={ this.state.titleSelectedStatus } filterTitleClick={ this.filterTitleClick } />
          {/* 前三个筛选 */}
          <FilterPicker />
          {/* 后一个选项 */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}

export default Filter

// 1、filterTitle组件的标题高亮效果由该组件自身或该组件外的遮罩层或者其他组件兄弟控制，因此进行状态提升，将控制高亮的状态定义到共同的父组件filter组件中
// 2、父组件filter然后将控制标题高亮的方法通过props传递给需要使用的各个子组件，子组件再通过props接收进行使用
// 3、此处将标题高亮的key与filterTitle组件中的标题的key保持一致，后续为选中状态的定义提供了便利
// 4、filterTitleClick是filterTitle点击事件，点击时对应的标题选项高亮并进行相关逻辑处理，形参clickItem是点击的某个具体标题选项
// -、点击时需要获取所有标题状态，因为state.titleSelectedStatus是一个对象，该对象涵盖所有标体选项的状态，然后再通过事件形参获取某个具体的点击项让它做状态改变
// -、先展开再进行针对具体标题项做改变，这个顺序不能变（先获取所有，再进行针对性的覆盖，达到改变某一个的目的）
// -、此处对象中key使用的中括号写法是ES6对象属性名表达式，即 xxx: { [a]: b } 等同于 xxx[a]=b 中括号中的a是变量
// -、ES6对象键名表达式不能与ES6简洁表达式同时使用，即直接 xxx:{ [a] } 这样子简写是错误的，必须为xxx[a]进行赋值
