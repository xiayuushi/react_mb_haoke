import { Component } from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

class Filter extends Component {
  state = {
    titleSelectedStatus,
    openType: '',
    filtersData: {}
  }

  onTitleClick = (clickItem) => {
    this.setState((state) => {
      return {
        titleSelectedStatus: {
          ...state.titleSelectedStatus,
          [clickItem]: true
        },
        openType: clickItem
      }
    })
  }

  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  onSure = () => {
    this.setState({
      openType: ''
    })
  }

  getFiltersData = async () => {
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const { body } = await this.$request(`/houses/condition?id=${value}`)
    console.log(body)
    this.setState(() => {
      return {
        filtersData: body
      }
    })
  }

  renderFilterPicker = () => {
    const { openType, filtersData: { area, subway, rentType, price } } = this.state
    if (openType !== 'area' && openType !== 'mode' && openType !== 'price') {
      return null
    }
    let data = []
    let cols = 3
    switch (openType) {
      case 'area': 
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default: 
        break
    }
    return (
      <FilterPicker onCancel={ this.onCancel } onSure={ this.onSure } data={ data } cols={ cols } />
    )
  }

  componentDidMount () {
    this.getFiltersData()
  }

  render () {
    return (
      <div className={ styles['filter-container'] }>

        {/* 前三个菜单的遮罩层 */}
        {
          this.state.openType === 'area' || this.state.openType === 'mode' || this.state.openType === 'price'
          ? <div className={ styles['mask'] } onClick={ this.onCancel }></div>
          : null
        }

        <div className={ styles['content'] }>
          {/* 标题栏 */}
          <FilterTitle titleSelectedStatus={ this.state.titleSelectedStatus } onTitleClick={ this.onTitleClick } />

          {/* 标题栏内容 - 前三个筛选 */}
          {
            this.renderFilterPicker()
          }
          
          {/* 标题栏内容 - 后一个选项 */}
          {
            this.state.openType === 'more'
            ? <FilterMore onCancel={ this.onCancel } onSure={ this.onSure } />
            : null
          }
        </div>
      </div>
    )
  }
}

export default Filter

// 1、filterTitle组件的标题高亮效果由该组件自身或该组件外的遮罩层或者其他组件兄弟控制，因此进行状态提升，将控制高亮的状态定义到共同的父组件filter组件中
// 2、父组件filter然后将控制标题高亮的方法通过props传递给需要使用的各个子组件，子组件再通过props接收进行使用
// 3、此处将标题高亮的key与filterTitle组件中的标题的key保持一致，后续为选中状态的定义提供了便利
// 4、onTitleClick是filterTitle点击事件，点击时对应的标题选项高亮并进行相关逻辑处理，形参clickItem是点击的某个具体标题选项
// -、点击时需要获取所有标题状态，因为state.titleSelectedStatus是一个对象，该对象涵盖所有标体选项的状态，然后再通过事件形参获取某个具体的点击项让它做状态改变
// -、先展开再进行针对具体标题项做改变，这个顺序不能变（先获取所有，再进行针对性的覆盖，达到改变某一个的目的）
// -、此处对象中key使用的中括号写法是ES6对象属性名表达式，即 xxx: { [a]: b } 等同于 xxx[a]=b 中括号中的a是变量
// -、ES6对象键名表达式不能与ES6简洁表达式同时使用，即直接 xxx:{ [a] } 这样子简写是错误的，必须为xxx[a]进行赋值
// 5、openType控制filterTitle对应的内容filterPicker组件与filterMore组件的展示与隐藏
// -、openType的值与标体栏filterTitle组件的选项对应，当选项值为area、mode、price时对应展示区域、方式、租金的内容，该内容都是下拉选项的形式存在的，即filterPicker组件
// -、openType的值为more时对应展示筛选的内容，该内容是与之前不同的形式存在的，即filterMore组件
// 6、renderFilterPicker()用于渲染FilterPicker组件的内容数据，因此整合了渲染FilterPicker所需的各种数据
// -、FilterPicker组件中使用到了antd-mobile的PickerView组件，该组件的data属性就是设置数据源的地方，即renderFilterPicker()中整合的data就是为了给PickerView的data属性使用的
// -、pickerView组件中如果出现内容"偏左"无法居中的情况，说明该组件的cols属性列数设置不合理（antd-mobile默认设置cols值是3），应该根据不同的内容展示合适的列数才能正常"居中"显示
